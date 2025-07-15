import { Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function SideBar() {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex flex-column text-white"
      style={{
        backgroundColor: '#1a1a1a',
        position: 'sticky',
        top: '56px',
        height: 'calc(100vh - 56px)',
        overflowY: 'auto'
      }}
    >
      <h4 className="p-3">Menu</h4>

      <Nav className="flex-column flex-grow-1 px-2">
        <Nav.Link href="#" className="text-white">Cate 1</Nav.Link>
        <Nav.Link href="#" className="text-white">Cate 2</Nav.Link>
        <Nav.Link href="#" className="text-white">Cate 3</Nav.Link>
        <Nav.Link href="#" className="text-white">Cate 4</Nav.Link>
        <Nav.Link href="#" className="text-white">Cate 5</Nav.Link>
        <Nav.Link href="#" className="text-white">Cate 6</Nav.Link>
        <Nav.Link href="#" className="text-white">Cate 7</Nav.Link>

        <Nav.Link
          onClick={() => navigate('/pre-order')}
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
