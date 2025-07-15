import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PreOrderPage from './Customer/PreOrderInfor';
import CustomerScreen from './Customer/CustomerScreen';

function TestRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/pre-order" element={<PreOrderPage />} />
        <Route path="/" element={<CustomerScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default TestRouter;
