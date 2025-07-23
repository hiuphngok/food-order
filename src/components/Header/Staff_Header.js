import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Staff_Header({ setUser }) {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <Navbar expand="lg" variant="dark" fixed="top" style={{ backgroundColor: "#1a1a1a" }}>
      <Container>
        <Navbar.Brand onClick={() => navigate("/staff")} style={{ cursor: "pointer" }}>
          Staff Dashboard
        </Navbar.Brand>
        <Nav className="ms-auto align-items-center">
          <Nav.Link disabled className="text-white me-3">
            {user?.username}
          </Nav.Link>
          <Button variant="outline-light" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
}
