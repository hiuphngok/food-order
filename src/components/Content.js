import React, { useState } from 'react';
import TableList from './TableList';
import OrderPanel from './OrderPanel';
import { tables as dummyTables } from '../data/dummyTables';
import { Col, Row } from 'react-bootstrap';


const Content = ({ filter }) => {
    const [selectedTable, setSelectedTable] = useState(null);

    const filteredTables = dummyTables.filter(
        (t) => !filter || t.status === filter
    );

    return (
        <Row>
            <Col xs={6}>
                <TableList tables={filteredTables} onSelectTable={setSelectedTable} />
            </Col>
            <Col xs={6}>
                <OrderPanel table={selectedTable} />
            </Col>
        </Row>
    );
};

export default Content;
