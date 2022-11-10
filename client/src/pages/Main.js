import {Link} from 'react-router-dom';
import React, {useState} from 'react';
import Nav from 'react-bootstrap/Nav';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const Main = () => {
//   const [show, setShow] = useState(false);

  return (
    <div>
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
      <div>
        <Card className="container " style={{height: '40rem', width: '81rem'}}>
          <Card.Body>
            {/* <Card.Title>Card Title</Card.Title> */}
            <Card.Subtitle className="mb-2 text-muted">Chat Box</Card.Subtitle>
            <Card.Text>
                          placeholder text
                          wooh more messages
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
      <div>
        
      </div>
      <div>
        <FloatingLabel
          controlId="floatingTextarea"
          label="Enter text here"
        //   className="container mb-3"
        >

          <Form.Control style={{height: '5rem'}} as="textarea" placeholder="" />
          <Button variant="light">Send</Button>{' '}
        </FloatingLabel>
      </div>
    </div>
  );

};

export default Main;
