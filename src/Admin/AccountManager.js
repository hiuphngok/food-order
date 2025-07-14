import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AccountManager() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:9999/users").then((result) => setUsers(result.data));
    axios.get("http://localhost:9999/roles").then((result) => setRoles(result.data));
    axios.get("http://localhost:9999/tables").then((result) => setTables(result.data));
  }, []);

  const cleanUser = (u) => ({
    ...u,
    roleId: Number(u.roleId),
    tableId: u.roleId === 1 ? Number(u.tableId) : undefined,
    ...(u.id ? { id: Number(u.id) } : {})
  });

  const handleSubmit = () => {
    const cleaned = cleanUser(selectedUser);

    if (isAdding) {
      const { id, ...payload } = cleaned;
      axios.post("http://localhost:9999/users", payload).then((res) => {
        setUsers([...users, res.data]);
        alert("Đã thêm tài khoản!");
        setSelectedUser(null);
        setIsAdding(false);
      });
    } else {
      axios
        .put(`http://localhost:9999/users/${cleaned.id}`, cleaned)
        .then((res) => {
          const updated = users.map((u) => (u.id === res.data.id ? res.data : u));
          setUsers(updated);
          alert("Đã cập nhật tài khoản!");
        });
    }
  };

  const handleDelete = () => {
    if (!selectedUser?.id) return alert("Not Found!");
    if (!window.confirm(`Xoá tài khoản "${selectedUser.username}"?`)) return;

    axios.delete(`http://localhost:9999/users/${selectedUser.id}`).then(() => {
      setUsers(users.filter((u) => u.id !== selectedUser.id));
      setSelectedUser(null);
      setIsAdding(false);
      alert("Đã xoá tài khoản!");
    });
  };

  return (
    <>
      <Button
        className="mb-3"
        onClick={() => {
          setSelectedUser({
            username: "",
            password: "",
            roleId: roles[0]?.id || 1,
            tableId: undefined
          });
          setIsAdding(true);
        }}
      >
        Add Account
      </Button>

      <Container>
        <Row>
          <Col xs={6}>
            <Form className="mb-3">
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Search username..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Form.Group>
            </Form>

            <Table bordered hover striped>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Table</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter((u) =>
                    u.username.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((u) => (
                    <tr
                      key={u.id}
                      style={{
                        backgroundColor:
                          selectedUser?.id === u.id ? "#f0f8ff" : "transparent",
                        fontWeight:
                          selectedUser?.id === u.id ? "bold" : "normal",
                        cursor: "pointer"
                      }}
                    >
                      <td>{u.id}</td>
                      <td>{u.username}</td>
                      <td>
                        {roles.find((r) => r.id == u.roleId)?.name || "Unknown"}
                      </td>
                      <td>
                        {u.roleId === 1
                          ? tables.find((t) => t.id == u.tableId)?.name || "-"
                          : "-"}
                      </td>
                      <td>
                        <Button
                          className="btn btn-secondary"
                          onClick={() => {
                            setSelectedUser(u);
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

          <Col xs={6}>
            <h6>Account Details</h6>
            {selectedUser ? (
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    value={selectedUser.username}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, username: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={selectedUser.password}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, password: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    value={selectedUser.roleId}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        roleId: Number(e.target.value),
                        tableId: Number(e.target.value) === 1 ? tables[0]?.id : undefined
                      })
                    }
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {selectedUser.roleId === 1 && (
                  <Form.Group className="mb-3">
                    <Form.Label>Table</Form.Label>
                    <Form.Select
                      value={selectedUser.tableId || ""}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          tableId: Number(e.target.value)
                        })
                      }
                    >
                      {tables.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )}

                <Button type="submit" className="btn btn-primary">
                  {isAdding ? "Add" : "Save Changes"}
                </Button>
                <Button
                  variant="danger"
                  className="ms-2"
                  onClick={handleDelete}
                >
                  Delete Account
                </Button>
              </Form>
            ) : (
              <p>Please select an account.</p>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}
