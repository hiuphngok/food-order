import Header from '../components/Header/Header';
import SideBar from '../components/SideBar/SideBar';
import DashBoard from './DashBoard';
import { Row, Col, Container } from 'react-bootstrap';

export default function Admin_dashboard(){
    return (
        <>
            <Header />
            <Container fluid>
                <Row className="gx-0" style={{ paddingTop: '56px' }}>
                <Col lg={2} md={3}><SideBar /></Col>
                <Col lg={10} md={9}>
                    <Row className="gx-3 gy-4 px-3">
                        <DashBoard />
                    </Row>
                    
                </Col>
            </Row>
            </Container>
            
        </>
        
    )
};