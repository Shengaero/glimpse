import {Link} from 'react-router-dom';
import React, {useState} from 'react';
import Nav from 'react-bootstrap/Nav';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CardGroup from 'react-bootstrap/CardGroup';
// import Stack from 'react-bootstrap/Stack';

const Main = () => {
//   const [show, setShow] = useState(false);

  return (
    <Container fluid>
      <Nav className="bg-light" defaultActiveKey="/home" as="ul">
        <Nav.Item as="li">
          <Nav.Link href="/home">Placeholder</Nav.Link>
        </Nav.Item>
        <Nav.Item as="li">
          <Nav.Link eventKey="link-1">Nav</Nav.Link>
        </Nav.Item>
        <Nav.Item as="li">
          <Nav.Link eventKey="link-2">Buttons</Nav.Link>
        </Nav.Item>
      </Nav>
      <Row>
        <Col md={2}>
          {/* <CardGroup> */}
          <Card className="container md-2" style={{height: '50rem', width: '20rem'}}>
            <Card.Body>
              {/* <Card.Title>Card Title</Card.Title> */}
              <Card.Subtitle className="mb-2 text-muted">Side Bar</Card.Subtitle>
              <Card.Text>
                placeholder text
                wooh more messages
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={10}>
          <Card style={{height: '50rem', width: 'max'}}>
            <Card.Body>
              {/* <Card.Title>Card Title</Card.Title> */}
              <Card.Subtitle className="mb-2 text-muted">Chat Box</Card.Subtitle>
              <Card.Text>
                          placeholder text
                          wooh more messages
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* </CardGroup> */}
      <div>
        <FloatingLabel
          controlId="floatingTextarea"
          label="Enter text here">
          <Form.Control style={{height: '5rem'}} as="textarea" placeholder="" />
          <Button variant="light">Send</Button>{' '}
        </FloatingLabel>
      </div>
    </Container>
  );

};

export default Main;
