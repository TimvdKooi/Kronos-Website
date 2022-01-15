import React from 'react'
import { ListGroup, Row, Col } from 'react-bootstrap';
import { Link} from "react-router-dom";

const AdminHome = () => {
    return <Row style={{marginTop: 20}}>
        <Col md={6}>
        <ListGroup>
        <ListGroup.Item as={Link} to={'/admin/approve-news'} action>Nieuwsitems goedkeuren</ListGroup.Item>
        <ListGroup.Item as={Link} to={'/admin/mailinglists'} action>Mailinglijsten</ListGroup.Item>
        <ListGroup.Item as={Link} to={'/admin/aliases'} action>Aliassen</ListGroup.Item>
        <ListGroup.Item as={Link} to={'/admin/pages'} action>Informatie pagina's</ListGroup.Item>
        <ListGroup.Item as={Link} to={'/admin/objects'} action>Generiek objecten beheren</ListGroup.Item>
    </ListGroup>
    </Col>
    </Row>
}

export default AdminHome