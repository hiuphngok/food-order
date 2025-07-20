import React, { useState } from 'react';
import Header from '../components/Header/Header';
import Home from './Home';
import CartModal from '../components/CartModal';
import { Button, Toast, ToastContainer } from 'react-bootstrap';
import { Bell, ShoppingCart } from 'lucide-react';

function CustomerScreen({ setUser }) {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [menu, setMenu] = useState([]); // ✅ Add this

  const showToastWithMessage = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCallStaff = () => {
    const requestData = {
      tableId: JSON.parse(localStorage.getItem('user')).tableId,
      time: new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' }),
      status: 'pending'
    };

    fetch('http://localhost:9999/staffCalls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    })
      .then(res => {
        if (!res.ok) throw new Error('Request failed');
        return res.json();
      })
      .then(() => {
        showToastWithMessage('Sent a request to the staff!');
      })
      .catch((err) => {
        console.error('Request failed:', err);
        showToastWithMessage('Failed to send request to staff.');
      });
  };

  const addToCart = (product) => {
    setCart(prev => {
      const found = prev.find(item => item.id === product.id);
      const inCartQuantity = found ? found.quantity : 0;

      const menuItem = menu.find(m => m.id == product.id);
      if (menuItem && inCartQuantity + 1 > menuItem.stock) {
        showToastWithMessage(`"${product.name}" only has ${menuItem.stock} left in stock.`);
        return prev;
      }

      if (found) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const changeQuantity = (id, amount) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + amount;
          const menuItem = menu.find(m => m.id == id);
          if (newQuantity > menuItem.stock) {
            showToastWithMessage(`"${item.name}" only has ${menuItem.stock} left.`);
            return item;
          }
          return { ...item, quantity: Math.max(newQuantity, 1) };
        }
        return item;
      });
    });
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <Header setUser={setUser} setSearchTerm={setSearchTerm} />
      <Home addToCart={addToCart} searchTerm={searchTerm} setMenu={setMenu} />
      <CartModal
        show={showCart}
        onClose={() => setShowCart(false)}
        cart={cart}
        changeQuantity={changeQuantity}
        removeItem={removeItem}
        total={total}
        showToast={showToastWithMessage}
      />

      <Button
        title='Call Staff'
        style={{
          position: 'fixed',
          bottom: 60,
          right: 0,
          backgroundColor: '#007bff',
          padding: '12px 20px',
          fontWeight: 'bold',
          borderRadius: '50%',
          cursor: 'pointer'
        }}
        onClick={handleCallStaff}
      >
        <Bell />
      </Button>

      <ToastContainer style={{ position: 'fixed', right: 0, top: 50 }}>
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide bg="primary">
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <button
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          color: 'white',
          backgroundColor: 'orange',
          padding: '12px 20px',
          fontWeight: 'bold',
          borderTopLeftRadius: '5px',
          cursor: 'pointer',
          border: 'none'
        }}
        onClick={() => setShowCart(true)}
      >
        <ShoppingCart /> {total.toLocaleString()}₫
      </button>
    </div>
  );
}

export default CustomerScreen;
