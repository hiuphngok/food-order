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
      <h4 className="p-3">More</h4>

      <Nav className="flex-column flex-grow-1 px-2 ">
        <div className="px-2 text-uppercase text-white">Manage</div>
        <Nav.Link as={Link} to="all" className="text-white">All tables</Nav.Link>
        <Nav.Link as={Link} to="active" className="text-white">Active tables</Nav.Link>

        <div className="px-2 mt-3 text-uppercase text-white">Checkout</div>
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
