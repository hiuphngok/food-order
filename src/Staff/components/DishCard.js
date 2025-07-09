import UpdateStatusButton from "./UpdateStatusButton";
import '../css/style.css';

const DishCard = ({ dish }) => (
  <div className="dish-card">
    <img src={dish.img} alt={dish.name} />
    <div>
      <p>{dish.name}</p>
      <UpdateStatusButton status={dish.status} className="order-status-btn"/>
    </div>
  </div>
);
export default DishCard;