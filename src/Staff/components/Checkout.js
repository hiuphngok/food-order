import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Table } from "react-bootstrap";
import StaffCall from './StaffCall';
import './style.css';


export default function Checkout() {
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [calls, setCalls] = useState([]);
  const [menu, setMenu] = useState([]);
  const [confirmedTableId, setConfirmedTableId] = useState(null);


  useEffect(() => {
    axios.get("http://localhost:9999/orders").then((res) => setOrders(res.data));
    axios.get("http://localhost:9999/tables").then((res) => setTables(res.data));
    axios.get("http://localhost:9999/menu").then((res) => setMenu(res.data));
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
    orders.filter(order => order.tableId === tableId);

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

  const handleConfirmCheckout = (tableId) => {
    setConfirmedTableId(tableId); // Hiện QR cho table này
  };

  const handlePaid = async (tableId) => {
    try {
      // 1. Xoá staffCalls theo tableId
      const deleteCalls = calls
        .filter(call => call.tableId === tableId)
        .map(call => axios.delete(`http://localhost:9999/staffCalls/${call.id}`));
      await Promise.all(deleteCalls);

      // 2. Xoá các orders theo tableId
      const tableOrders = orders.filter(order => order.tableId === tableId);
      const deleteOrderPromises = tableOrders.map(order =>
        axios.delete(`http://localhost:9999/orders/${order.id}`)
      );
      await Promise.all(deleteOrderPromises);

      // 3. Cập nhật state
      setCalls(prev => prev.filter(call => call.tableId !== tableId));
      setOrders(prev => prev.filter(order => order.tableId !== tableId));
      setConfirmedTableId(null);

      alert("Checkout completed. All orders and staff calls cleared.");
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
                                  <td>{menuItem.price}$</td>
                                  <td>{item.quantity}</td>
                                  <td>{subtotal.toLocaleString()}$</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      </td>
                    </td>
                    <td>{new Date(checkoutTime).toLocaleString()}</td>
                    <td>{calculateTotal(ordersForTable).toLocaleString()}$</td>
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
              <h1>Ảnh gì đó ở đây</h1>
              <br />
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
    </Container>
  );
}
