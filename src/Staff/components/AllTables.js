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
import { tab } from "@testing-library/user-event/dist/tab";

export default function AllTables() {
    const [orders, setOrders] = useState([]);
    const [tables, setTables] = useState([]);
    const [menu, setMenu] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [search, setSearch] = useState("");
    const [newItem, setNewItem] = useState({ menuId: "", quantity: 1 });


    useEffect(() => {
        axios.get("http://localhost:9999/orders").then((res) => setOrders(res.data));
        axios.get("http://localhost:9999/tables").then((res) => setTables(res.data));
        axios.get("http://localhost:9999/menu").then((res) => setMenu(res.data));
    }, []);

    const createOrder = (tableId) => {
        const now = new Date();
        const expected = new Date(now.getTime() + 15 * 60000); // +15 phút

        const newOrder = {
            tableId: tableId,
            status: "pending",
            orderTime: now.toISOString(),
            expectedServeTime: expected.toISOString(),
            items: []
        };

        axios
            .post("http://localhost:9999/orders", newOrder)
            .then((res) => {
                const created = res.data;
                setOrders((prev) => [...prev, created]);
                setSelectedOrder(created);
            })
            .catch((err) => {
                console.error("Failed to create new order:", err);
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
            });
    };


    const getOrder = (tableId) =>
        orders.find((o) => Number(o.tableId) === Number(tableId)) || null;

    const getMenuName = (menuId) =>
        menu.find((m) => Number(m.id) === Number(menuId))?.name || "Unknown";

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
            })
            .catch((err) => {
                console.error("Failed to update item:", err);
            });
    };

    return (
        <Container style={{ position: "fixed", top: "56px" }}>
            <Row>
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
                <Col xs={6}>

                    <Row>
                        {tables
                            .map((table) => (
                                <Col xs={12} md={6} lg={6} key={table.id}>
                                    <Card style={{ marginBottom: '16px' }}>
                                        <Card.Body>
                                            <Card.Title>Table: {table.name}</Card.Title>
                                            {getOrder(table.id) ? (
                                                <>
                                                    <Card.Subtitle className="mb-2 text-muted">
                                                        Order ID: {getOrder(table.id).id}
                                                    </Card.Subtitle>
                                                    <Card.Text>
                                                        Status: <strong>{getOrder(table.id).status}</strong><br />
                                                        Order date: {new Date(getOrder(table.id).orderTime).toLocaleString()}
                                                    </Card.Text>
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() => setSelectedOrder(getOrder(table.id))}
                                                    >
                                                        Details
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                   <Card.Subtitle className="mb-2 text-muted">
                                                        No active order
                                                    </Card.Subtitle>
                                                    <Card.Text>
                                                        Click to create a new order for this table.                                                        
                                                    </Card.Text>
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() => createOrder(table.id)}
                                                    >
                                                        Create new order
                                                    </Button>
                                                </>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                    </Row>

                </Col>

                <Col xs={6}>
                    <h6>Order Details</h6>
                    {selectedOrder ? (
                        <>
                            <Table bordered hover>
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
                                                {item.status}
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
                            </Table>

                            {selectedOrder.items.length === 0 && (
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
                                    </Form>
                                </>
                            )}
                        </>
                    ) : (
                        <p>Please select an order to see details.</p>
                    )}

                </Col>
            </Row>
        </Container>
    );
}
