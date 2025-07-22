import { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Table,
    Form,
    Button,
    DropdownButton,
    Dropdown,
    ButtonGroup, Card
} from "react-bootstrap";
import axios from "axios";
import StaffCall from "./StaffCall";
import './style.css';

export default function ActiveTables() {
    const [orders, setOrders] = useState([]);
    const [tables, setTables] = useState([]);
    const [menu, setMenu] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [search, setSearch] = useState("");
    const [newItem, setNewItem] = useState({ menuId: "", quantity: 1 });
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        axios.get("http://localhost:9999/orders").then((res) => setOrders(res.data));
        axios.get("http://localhost:9999/tables").then((res) => setTables(res.data));
        axios.get("http://localhost:9999/menu").then((res) => setMenu(res.data));
    }, []);

    const getTableName = (tableId) =>
        tables.find((t) => Number(t.id) === Number(tableId))?.name || "Unknown";

    const getMenuName = (menuId) =>
        menu.find((m) => Number(m.id) === Number(menuId))?.name || "Unknown";

    const filteredSearchTablesNames = setSearch ? orders.filter(orders => getTableName(orders.tableId).toLowerCase().includes(search.toLowerCase())) : tables;

    const updateOrderItem = (index, field, value) => {
        if (!selectedOrder) return;

        const updatedItems = [...selectedOrder.items];
        updatedItems[index] = {
            ...updatedItems[index],
            [field]: field === "remainingMinutes" || field === "quantity"
                ? Number(value) : value
        };

        const updatedOrder = {
            ...selectedOrder,
            items: updatedItems
        };

        // Gửi PUT lên API
        axios
            .put(`http://localhost:9999/orders/${updatedOrder.id}`, updatedOrder)
            .then(() => {
                setSelectedOrder(updatedOrder); // cập nhật lại local state
                setOrders((prev) =>
                    prev.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
                );
                console.log("Updated order item successfully.");
                alert("Updated order item successfully.");
            })
            .catch((err) => {
                console.error("Failed to update item:", err);
                alert("Failed to update item.");
            });
    };

    const handleAddItem = (e) => {
        e.preventDefault();
        if (!selectedOrder) return;

        const updatedOrder = {
            ...selectedOrder,
            items: [
                ...selectedOrder.items,
                {
                    menuId: Number(newItem.menuId),
                    quantity: newItem.quantity,
                    status: "preparing",
                    remainingMinutes: 10
                }
            ]
        };

        axios
            .put(`http://localhost:9999/orders/${selectedOrder.id}`, updatedOrder)
            .then(() => {
                setOrders((prev) =>
                    prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
                );
                setSelectedOrder(updatedOrder);
                setNewItem({ menuId: "", quantity: 1 });
                console.log("Added new item successfully.");
                alert("Added new item successfully.");
            });
    };

    const handleDelete = () => {
        if (!selectedOrder?.id) return alert("Can not define order!");

        axios
            .delete(`http://localhost:9999/orders/${selectedOrder.id}`)
            .then(() => {
                setOrders(orders.filter((item) => item.id !== selectedOrder.id));
                setSelectedOrder(null);
                setIsAdding(false);
                console.log("Deleted order item successfully.");
                alert("Deleted order item successfully.");
            })
            .catch((err) => {
                console.error(err);
                alert("Failed to delete order item.");
            });
    };

    return (
        <>
            <Container>
                <h1 className="text-center">Active Tables</h1>
                <div className="text-center">
                    <Form className="mb-3">
                        <Form.Group>
                            <Form.Control
                                type="text"
                                placeholder="Search by table name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </div>

                <Row className="mt-4">
                    <Col xs={12} md={8}>
                        <Row>
                            {filteredSearchTablesNames.map((o) => (
                                o.status !== "checked" && (
                                    <Col xs={12} md={6} lg={6} key={o.id}>
                                        <Card style={{ marginBottom: '16px' }}>
                                            <Card.Body>
                                                <Card.Title>Table: {getTableName(o.tableId)}</Card.Title>
                                                <Card.Subtitle className="mb-2 text-muted">Order ID: {o.id}</Card.Subtitle>
                                                <Card.Text>
                                                    Status: <strong>{o.status}</strong><br />
                                                    Order date: {new Date(o.orderTime).toLocaleString()}
                                                </Card.Text>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => setSelectedOrder(o)}
                                                >
                                                    Details
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                )))}
                        </Row>

                    </Col>

                    <Col xs={12} md={4}>
                        <div className="border p-3"><h6>Order Details</h6>
                            {selectedOrder ? (
                                <>
                                    <Table>
                                        <>
                                            <thead>
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Quantity</th>
                                                    <th>Status</th>
                                                    <th>Remaining (min)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedOrder.items.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td>{getMenuName(item.menuId)}</td>
                                                        <td>
                                                            <Button
                                                                variant="outline-secondary"
                                                                size="sm"
                                                                onClick={() =>
                                                                    updateOrderItem(idx, "quantity", item.quantity - 1)
                                                                }
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                -
                                                            </Button>{" "}
                                                            {item.quantity}{" "}
                                                            <Button
                                                                variant="outline-secondary"
                                                                size="sm"
                                                                onClick={() =>
                                                                    updateOrderItem(idx, "quantity", item.quantity + 1)
                                                                }
                                                            >
                                                                +
                                                            </Button>
                                                        </td>
                                                        <td>
                                                            {item.status}{item.status === 'ordered' && <h6 className="text-danger">new order</h6>}
                                                            <DropdownButton
                                                                as={ButtonGroup}
                                                                size="sm"
                                                                variant="secondary"
                                                                title="Change Status"
                                                                onSelect={(status) => updateOrderItem(idx, "status", status)}
                                                            >
                                                                <Dropdown.Item eventKey="preparing">Preparing</Dropdown.Item>
                                                                <Dropdown.Item eventKey="received">Received</Dropdown.Item>
                                                                <Dropdown.Item eventKey="served">Served</Dropdown.Item>
                                                            </DropdownButton>
                                                        </td>
                                                        <td>
                                                            {item.remainingMinutes}
                                                            <DropdownButton
                                                                as={ButtonGroup}
                                                                size="sm"
                                                                variant="info"
                                                                title="Change Time"
                                                                onSelect={(val) =>
                                                                    updateOrderItem(idx, "remainingMinutes", val)
                                                                }
                                                            >
                                                                {[3, 5, 10, 15, 20, 30].map((min) => (
                                                                    <Dropdown.Item key={min} eventKey={min}>
                                                                        {min} min
                                                                    </Dropdown.Item>
                                                                ))}
                                                            </DropdownButton>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </>

                                    </Table>

                                    {selectedOrder && (
                                        <>
                                            <h6 className="mt-3">Add item to new order</h6>
                                            <Form onSubmit={handleAddItem}>
                                                <Form.Group>
                                                    <Form.Label>Menu</Form.Label>
                                                    <Form.Select
                                                        value={newItem.menuId}
                                                        onChange={(e) =>
                                                            setNewItem({ ...newItem, menuId: e.target.value })
                                                        }
                                                        required
                                                    >
                                                        <option value="">-- Choose a dish --</option>
                                                        {menu.map((m) => (
                                                            <option key={m.id} value={m.id}>
                                                                {m.name}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>

                                                <Form.Group className="mt-2">
                                                    <Form.Label>Quantity</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        value={newItem.quantity}
                                                        onChange={(e) =>
                                                            setNewItem({ ...newItem, quantity: Number(e.target.value) })
                                                        }
                                                        min={1}
                                                        required
                                                    />
                                                </Form.Group>

                                                <Button type="submit" className="mt-3">
                                                    Add Item
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    className="mt-3"
                                                    onClick={() => {
                                                        const confirmDelete = window.confirm(
                                                            `Confirm to delete"${selectedOrder.id}"?`
                                                        );
                                                        if (confirmDelete) {
                                                            handleDelete();
                                                        }
                                                    }}
                                                >Delete order
                                                </Button>
                                            </Form>
                                        </>
                                    )}
                                </>
                            ) : (
                                <p>Please select an order to see details.</p>
                            )}
                        </div>
                        <StaffCall />
                    </Col>
                </Row>
            </Container>
        </>
    );
}
