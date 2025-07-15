import Admin_Header from '../components/Header/Header';
import Admin_SideBar from '../components/SideBar/Admin_SideBar';
import { Row, Col, Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';

export default function Admin_dashboard({ setUser }){
    return (
        <>
            <Admin_Header setUser={setUser}/>
            <Container fluid style={{ paddingTop: '56px' }}>
                <Row>
                <Col lg={2} md={3} className="gx-0">
                    <Admin_SideBar />
                </Col>
                <Col lg={10} md={9} className="pt-5 px-4 gx-0">
                    <Outlet />
                </Col>
                </Row>
            </Container>
        </>  
    )
};