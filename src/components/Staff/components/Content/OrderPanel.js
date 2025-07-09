import DishCard from "./DishCard";
import '../css/style.css';

const OrderPanel = ({ table }) => {
  if (!table) return <div className="order-panel">Chọn bàn để xem món</div>;

  return (
    <div className="order-panel">
      <h2>Chi tiết bàn {table.id}</h2>
      {table.orders.map((dish, index) => (
        <DishCard key={index} dish={dish} />
      ))}
    </div>
  );
};
export default OrderPanel;