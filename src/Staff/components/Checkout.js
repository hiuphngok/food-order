import React, { useState, useEffect, use } from "react";
import axios from "axios";
import { Container, Row, Col, Table, Modal, Button, Form, Alert } from "react-bootstrap";
import StaffCall from './StaffCall';
import './style.css';


export default function Checkout() {
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [calls, setCalls] = useState([]);
  const [menu, setMenu] = useState([]);
  const [points, setPoints] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmedTableId, setConfirmedTableId] = useState(null);

  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentCustomerPoints, setCurrentCustomerPoints] = useState(0);
  const [usePoints, setUsePoints] = useState(false);
  const [currentTableId, setCurrentTableId] = useState(null);
  const [currentTotal, setCurrentTotal] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:9999/orders").then((res) => setOrders(res.data));
    axios.get("http://localhost:9999/tables").then((res) => setTables(res.data));
    axios.get("http://localhost:9999/menu").then((res) => setMenu(res.data));
    axios.get("http://localhost:9999/points").then((res) => {
      const normalizedPoints = res.data.map(point => ({
        ...point,
        usePoint: point.usePoint || 0 // Chuyển null/undefined thành 0
      }));
      setPoints(normalizedPoints);
    });
  }, []);

  useEffect(() => {
    fetch('http://localhost:9999/staffCalls')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setCalls(data);
      })
  }, []);

  const getCheckoutRequests = calls.filter(call => call.status === 'check-out');

  const getTableCheckoutRequests = () => {
    const tableIds = getCheckoutRequests.map(call => call.tableId);
    return [...new Set(tableIds)];
  };

  const getTableName = (tableId) =>
    tables.find((t) => Number(t.id) === Number(tableId))?.name || "Unknown";

  const getOrdersByTableId = (tableId) =>
    orders.filter(order => order.tableId === tableId && order.status === 'ordered');

  const getMenuById = (menuId) =>
    menu.find(item => item.id === menuId) || {};

  const calculateTotal = (orders) => {
    return orders.reduce((sum, order) => {
      return sum + order.items.reduce((subSum, item) => {
        const menuItem = getMenuById(item.menuId);
        return subSum + (menuItem.price || 0) * item.quantity;
      }, 0);
    }, 0);
  };

  const handlePhoneSubmit = async () => {
    if (!phoneNumber.trim()) {
      setShowPhoneModal(false);
      setShowConfirmModal(true);
      return;
    }

    // Tìm điểm của khách hàng
    const customerPoint = points.find(p => p.phoneNumber === phoneNumber);
    if (customerPoint) {
      setCurrentCustomerPoints(customerPoint.usePoint);
    } else {
      setCurrentCustomerPoints(0);
    }

    setShowPhoneModal(false);
    setConfirmedTableId(currentTableId);
  };

  const handleConfirmWithoutPhone = () => {
    setShowConfirmModal(false);
    setPhoneNumber("");
    setCurrentCustomerPoints(0);
    setUsePoints(false); // Reset checkbox sử dụng điểm
    setConfirmedTableId(currentTableId); // Vẫn cho phép thanh toán
  };

  const handleBackToPhone = () => {
    setShowConfirmModal(false);
    setShowPhoneModal(true);
  };

  const handleConfirmCheckout = (tableId) => {
    const ordersForTable = getOrdersByTableId(tableId);
    const total = calculateTotal(ordersForTable);

    setCurrentTableId(tableId);
    setCurrentTotal(total);
    setShowPhoneModal(true); // Hiện modal nhập số điện thoại
  };

  const calculateFinalTotal = () => {
    let finalTotal = currentTotal;
    if (usePoints && currentCustomerPoints > 0 && phoneNumber.trim()) {
      const pointsUsed = Math.min(currentCustomerPoints, currentTotal);
      finalTotal = Math.max(0, currentTotal - pointsUsed);
    }
    return finalTotal;
  };

  const calculatePointsUsed = () => {
    if (usePoints && currentCustomerPoints > 0 && phoneNumber.trim()) {
      return Math.min(currentCustomerPoints, currentTotal);
    }
    return 0;
  };
  const calculateEarnedPoints = () => {
    return Math.floor(currentTotal * 0.05);
  };

  const handlePaid = async (tableId) => {
    try {
      const finalTotal = calculateFinalTotal();
      const earnedPoints = calculateEarnedPoints();
      const pointsUsed = calculatePointsUsed();
      if (phoneNumber.trim()) {
        const existingCustomer = points.find(p => p.phoneNumber === phoneNumber);

        if (existingCustomer) {
          let currentPoints = existingCustomer.usePoint || 0;
          let newPoints = currentPoints + earnedPoints;

          if (pointsUsed > 0) {
            newPoints = Math.max(0, newPoints - pointsUsed);
          }

          await axios.put(`http://localhost:9999/points/${existingCustomer.id}`, {
            ...existingCustomer,
            usePoint: Math.max(0, newPoints)
          });

          setPoints(prev => prev.map(p =>
            p.id === existingCustomer.id
              ? { ...p, usePoint: Math.max(0, newPoints) }
              : p
          ));

        } else {
          const newCustomer = await axios.post("http://localhost:9999/points", {
            phoneNumber,
            usePoint: Math.max(0, earnedPoints)
          });

          setPoints(prev => [...prev, {
            ...newCustomer.data,
            usePoint: newCustomer.data.usePoint || 0 // Đảm bảo không null
          }]);
        }
      }
      // 1. Xoá staffCalls theo tableId
      const deleteCalls = calls
        .filter(call => call.tableId === tableId)
        .map(call => axios.delete(`http://localhost:9999/staffCalls/${call.id}`));
      await Promise.all(deleteCalls);

      // 2. Cập nhật status các orders theo tableId thành "checked"
      const tableOrders = orders.filter(order => order.tableId === tableId);

      const updateOrderPromises = tableOrders.map(order => {
        const updatedOrder = { ...order, status: 'checked' }; // chỉ đổi status
        return axios.put(`http://localhost:9999/orders/${order.id}`, updatedOrder);
      });

      await Promise.all(updateOrderPromises);


      // 3. Cập nhật state
      setCalls(prev => prev.filter(call => call.tableId !== tableId));
      setOrders(prev => prev.filter(order => order.tableId !== tableId));

      setConfirmedTableId(null);
      setPhoneNumber('');
      setCurrentCustomerPoints(0);
      setUsePoints(false);
      setCurrentTableId(null);
      setCurrentTotal(0);
      if (phoneNumber.trim()) {
        alert(`Checkout completed\nPoints earned: +${earnedPoints}\nPoint used: -${pointsUsed}\nTotal: ${finalTotal.toLocaleString()}đ`);
      } else {
        alert(`Checkout completed\nTotal: ${finalTotal.toLocaleString()}đ`);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to process payment.");
    }
  };

  const mergeItemsByMenu = (orders) => {
    const itemMap = new Map();

    orders.forEach(order => {
      order.items.forEach(item => {
        const key = item.menuId;
        const existing = itemMap.get(key);

        if (existing) {
          existing.quantity += item.quantity;
        } else {
          itemMap.set(key, { ...item });
        }
      });
    });

    return Array.from(itemMap.values());
  };

  return (
    <Container>
      <h1 className="text-center">Checkout request list</h1>
      <Row className="mt-4">
        <Col xs={12} md={8}>
          <Table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Table</th>
                <th>Orders</th>
                <th>Request checkout time</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {getTableCheckoutRequests().map((tableId) => {
                const ordersForTable = getOrdersByTableId(tableId);
                const checkoutTime = getCheckoutRequests.find(call => call.tableId === tableId)?.time;

                return (
                  <tr key={tableId}>
                    <td>{getTableName(tableId)}</td>
                    <td>
                      <td>
                        <Table size="sm" bordered>
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Price</th>
                              <th>Quantity</th>
                              <th>Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mergeItemsByMenu(ordersForTable).map(item => {
                              const menuItem = getMenuById(item.menuId);
                              const subtotal = menuItem.price * item.quantity;

                              return (
                                <tr key={item.menuId}>
                                  <td>{menuItem.name}</td>
                                  <td>{menuItem.price}đ</td>
                                  <td>{item.quantity}</td>
                                  <td>{subtotal.toLocaleString()}đ</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      </td>
                    </td>
                    <td>{new Date(checkoutTime).toLocaleString()}</td>
                    <td>{calculateTotal(ordersForTable).toLocaleString()}đ</td>
                    <td>
                      <button className="btn btn-success btn-sm" onClick={() => handleConfirmCheckout(tableId)}>Confirm</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Col>
        <Col xs={12} md={4}>
          <h6 className="border p-3">Checkout: </h6>
          {confirmedTableId ? (
            <div className="text-center">
              <h4>Scan to pay</h4>
              <h1>QR code here</h1>
              {phoneNumber.trim() && (
                <div className="mb-3">
                  <Alert variant="info">
                    <strong>SĐT:</strong> {phoneNumber}<br />
                    <strong>Điểm hiện tại:</strong> {currentCustomerPoints.toLocaleString()}<br />
                    <strong>Điểm tích lũy:</strong> +{calculateEarnedPoints().toLocaleString()}<br />
                    <strong>Tổng tiền gốc:</strong> {currentTotal.toLocaleString()}đ<br />
                    {usePoints && currentCustomerPoints > 0 && (
                      <>
                        <strong>Điểm sử dụng:</strong> -{calculatePointsUsed().toLocaleString()}<br />
                      </>
                    )}
                    <strong>Thành tiền:</strong> {calculateFinalTotal().toLocaleString()}đ
                  </Alert>

                  <Form.Check
                    type="checkbox"
                    label={`Sử dụng tối đa ${Math.min(currentCustomerPoints, currentTotal).toLocaleString()} điểm để giảm giá`}
                    checked={usePoints}
                    onChange={(e) => setUsePoints(e.target.checked)}
                    disabled={currentCustomerPoints === 0 || currentTotal === 0}
                  />
                </div>
              )}

              <button className="btn btn-success mt-3" onClick={() => handlePaid(confirmedTableId)}>Paid</button>
            </div>
          ) : (
            <div className="text-center">
              <h4>Select a table to checkout</h4>
            </div>
          )}
          <StaffCall />
        </Col>
      </Row>

      <Modal show={showPhoneModal} onHide={() => setShowPhoneModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Phone number:</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Phone number customer (earn point)</Form.Label>
              <Form.Control
                type="text"
                placeholder="input phone number..."
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <Form.Text className="text-muted">
                Space if customer does not want to enter phone number
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPhoneModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePhoneSubmit}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal xác nhận không nhập SĐT */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you don't want to enter a phone number?</p>
          <p className="text-muted">Customer will not earn points for this order.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleBackToPhone}>
            Back to input phone number
          </Button>
          <Button variant="primary" onClick={handleConfirmWithoutPhone}>
            Yes, confirm without phone
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
