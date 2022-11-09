import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

const Home = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className='jumbotron position-absolute top-50 start-50 translate-middle d-flex flex-column'>
      <h1 className='display-1'>GLIMPSE</h1>
      <div className='text-center pt-3'>
        <Button variant="dark w-50" onClick={handleShow}>
                Login
        </Button>
      </div>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                autoFocus
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' placeholder='password' />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <div className='d-grid gap-2 mx-auto col-10'>

            <Button variant="dark" onClick={handleClose}>
                    Login
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;
