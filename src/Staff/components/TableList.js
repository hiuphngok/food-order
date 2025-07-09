import TableCard from "./TableCard";
import '../css/style.css';
import { Row, Col } from "react-bootstrap";

const TableList = ({ tables, onSelectTable }) => (
    <Row className="table-list">
        {tables.map((table) => (
            <Col xs={6} key={table.id}>
                <TableCard table={table} onClick={() => onSelectTable(table)}/>
            </Col>
        ))}
    </Row>
);
export default TableList;
