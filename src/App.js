import React, { useState } from 'react';
import Header from './components/Header/Header';
import Home from './components/Home';
import CartModal from './components/CartModal';

function App() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const addToCart = (product) => {
    setCart(prev => {
      const found = prev.find(item => item.id === product.id);
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
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity + amount, 1) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <Header />
      <Home addToCart={addToCart} />
      {/* <TotalAmount /> */}
      <CartModal
        show={showCart}
        onClose={() => setShowCart(false)}
        cart={cart}
        changeQuantity={changeQuantity}
        removeItem={removeItem}
        total={total}
      />
      <button
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          backgroundColor: 'orange',
          padding: '12px 20px',
          fontWeight: 'bold',
          borderTopLeftRadius: '5px',
          cursor: 'pointer',
          border: '1px solid black'
        }}
        onClick={() => setShowCart(true)}
      >
        🛒 {total.toLocaleString()}₫
      </button>
    </div>
  );
}

export default App;
