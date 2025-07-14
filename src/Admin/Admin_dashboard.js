import Header from '../components/Header/Header';
import Admin_SideBar from '../components/SideBar/Admin_SideBar';
import { Row, Col, Container } from 'react-bootstrap';
import AdminRoutes from './AdminRoutes';

export default function Admin_dashboard(){
    return (
        <>
        <Header />
        <Container fluid style={{ paddingTop: '56px' }}>
            <Row>
            <Col lg={2} md={3} className="gx-0">
                <Admin_SideBar />
            </Col>
            <Col lg={10} md={9} className="offset-lg-2 offset-md-3 pt-5 px-4 gx-0">
                <AdminRoutes />
            </Col>
            </Row>
        </Container>
        </>       
    )
};