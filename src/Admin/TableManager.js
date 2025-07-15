import { useEffect, useState } from "react";
import { Container, Row, Col, Table, Button, Form } from "react-bootstrap";
import axios from "axios";

export default function TableManager() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:9999/tables")
      .then((res) => setTables(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAdding) {
      axios.post("http://localhost:9999/tables", selectedTable)
        .then((res) => {
          setTables([...tables, res.data]);
          alert("Đã thêm bàn mới!");
          setSelectedTable(null);
          setIsAdding(false);
        })
        .catch((err) => console.error(err));
    } else {
      axios.put(`http://localhost:9999/tables/${selectedTable.id}`, selectedTable)
        .then((res) => {
          const updated = tables.map(t => t.id === res.data.id ? res.data : t);
          setTables(updated);
          alert("Cập nhật thành công!");
        })
        .catch((err) => console.error(err));
    }
  };

  const handleDelete = () => {
    if (!selectedTable?.id) return;

    if (window.confirm(`Bạn có chắc muốn xoá bàn "${selectedTable.name}" không?`)) {
      axios.delete(`http://localhost:9999/tables/${selectedTable.id}`)
        .then(() => {
          setTables(tables.filter(t => t.id !== selectedTable.id));
          setSelectedTable(null);
          setIsAdding(false);
        })
        .catch(err => console.error(err));
    }
  };

  return (
    <Container>
      <h3 className="my-3">Table Manager</h3>
      <Button className="mb-3" onClick={() => {
        setSelectedTable({ name: "" });
        setIsAdding(true);
      }}>
        Add a Table
      </Button>
      <Row>
        <Col md={6}>
          <Table bordered hover striped>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên bàn</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {tables.map((t) => (
                <tr key={t.id}
                    style={{
                      backgroundColor: selectedTable?.id === t.id ? "#e0f7ff" : "transparent",
                      fontWeight: selectedTable?.id === t.id ? "bold" : "normal"
                    }}
                >
                  <td>{t.id}</td>
                  <td>{t.name}</td>
                  <td>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedTable(t);
                        setIsAdding(false);
                      }}
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>

        <Col md={6}>
          <h5>Table Details</h5>
          {selectedTable ? (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Tên bàn</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedTable.name}
                  onChange={(e) => setSelectedTable({ ...selectedTable, name: e.target.value })}
                  readOnly={!isAdding && selectedTable?.id}
                />
              </Form.Group>
              <Button type="submit" className="btn btn-primary">
                {isAdding ? "Add" : "Save Changes"}
              </Button>
              {!isAdding && (
                <Button variant="danger" className="ms-2" onClick={handleDelete}>
                  Delete
                </Button>
              )}
            </Form>
          ) : (
            <p></p>
          )}
        </Col>
      </Row>
    </Container>
  );
}
