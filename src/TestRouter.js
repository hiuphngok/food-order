import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PreOrderInfo from './Customer/PreOrderInfor';
import CustomerScreen from './Customer/CustomerScreen';

function TestRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/pre-order" element={<PreOrderInfo />} />
        <Route path="/" element={<CustomerScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default TestRouter;
