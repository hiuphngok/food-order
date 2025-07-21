import { Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

function SideBar({ onCategorySelect }) {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:9999/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Failed to fetch categories:', err));
  }, []);

  return (
    <div
      className="d-flex flex-column text-white"
      style={{
        backgroundColor: '#1a1a1a',
        position: 'fixed',
        top: '56px',
        height: 'calc(100vh - 56px)',
        overflowY: 'auto'
      }}
    >
      <h4 className="p-3" style={{ color: 'white' }}>Menu</h4>

      <Nav className="flex-column flex-grow-1 px-2">
        <Nav.Link
          key="all"
          href=""
          className="text-white sidebar-link"
          onClick={() => onCategorySelect(null)} // nút All
        >
          All
        </Nav.Link>
        {categories.map((cate) => (
          <Nav.Link
            key={cate.id}
            href=""
            className="text-white sidebar-link"
            onClick={() => onCategorySelect(Number(cate.id))}
          >
            {cate.name}
          </Nav.Link>
        ))}

        <Nav.Link
          onClick={() => navigate('/pre-order')}
          className="text-white mt-auto px-2 py-3"
          style={{ backgroundColor: '#111' }}
        >
          Get the pre-order information
        </Nav.Link>
      </Nav>
    </div >
  );
}

export default SideBar;
