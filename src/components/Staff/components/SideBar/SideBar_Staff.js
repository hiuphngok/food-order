import React from 'react';
import { Nav } from 'react-bootstrap';

function SideBar() {
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
        <Nav.Link href="#" className="text-white">Item 1</Nav.Link>
        <Nav.Link href="#" className="text-white">Item 2</Nav.Link>
        <Nav.Link href="#" className="text-white">Item 3</Nav.Link>
        <Nav.Link href="#" className="text-white">Item 4</Nav.Link>
        <Nav.Link href="#" className="text-white">Item 5</Nav.Link>
        <Nav.Link href="#" className="text-white">Item 6</Nav.Link>
        <Nav.Link href="#" className="text-white">Item 7</Nav.Link>

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
