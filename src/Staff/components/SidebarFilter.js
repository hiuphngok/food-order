import '../css/style.css';

const SidebarFilter = ({ onFilterChange }) => {
  return (
    <div className="sidebar">
      <h5>Sắp xếp</h5>
      <ul>
        <li onClick={() => onFilterChange("called_all")}>Đã gọi hết món</li>
        <li onClick={() => onFilterChange("called_some")}>Còn món chưa xong</li>
        <li onClick={() => onFilterChange("just_called")}>Vừa gọi món</li>
      </ul>
    </div>
  );
};
export default SidebarFilter;
