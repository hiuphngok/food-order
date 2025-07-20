import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function SideBar() {
  return (
    <div
      className="d-flex flex-column text-white"
      style={{
        backgroundColor: '#1a1a1a',
        color: 'white',
        height: '100vh',
        paddingTop: '56px',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '16.6666%'
      }}
    >
      <Nav className="flex-column flex-grow-1 px-2 ">
        <div className="px-2 text-uppercase text-white">Manage Staff Bar</div>
        <Nav.Link as={Link} to="all" className="text-white">All Tables</Nav.Link>
        <Nav.Link as={Link} to="active" className="text-white">Active Tables</Nav.Link>
        <Nav.Link as={Link} to="checkout" className="text-white">Checkout Requests</Nav.Link>
        <Nav.Link
          href="#"
          className="text-white mt-auto px-2 py-3"
          style={{ backgroundColor: '#111' }}
        >
          Get the pre-order information
        </Nav.Link>

      </Nav>
    </div>
  );
}

export default SideBar;
