import React, { useState } from 'react';
import ChatList from './ChatList';
import { Navbar, Button, Nav, Dropdown, Offcanvas } from 'react-bootstrap';
import * as Auth from '../utils/auth';

const ChatSideAreaNavbar = () => (
  <Navbar expand={false} className="px-2 py-0">
    {/* <span className="fw-bold">GLIMPSE</span> */}
    <Dropdown>
      <Dropdown.Toggle >
        <i className="bi bi-gear-fill"></i>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">This will be something else</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Later in the future</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Just a placeholder for now</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown >
  </Navbar>
);

const ChatSideAreaSearch = () => (
  <div className="search">
    <div className="search-form">
      <input type="text" placeholder="Search" />
    </div>
  </div>
);

const ChatSideAreaNavBottom = () => (
  <Nav as="nav" className="nav-bottom px-2">
    <div>
      <img src='' alt='' />
      <span className="user">User</span>
    </div>
    <Button className="py-0" onClick={() => {
      Auth.logout();
    }}>
      Logout
    </Button>
  </Nav>
);

export default function ChatSideArea(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <Button className='off-canvas-btn' variant="primary" onClick={handleShow}>
        Chat
      </Button>

      <Offcanvas className='off-canvas' show={show} onHide={handleClose}>
        <Offcanvas.Header className='off-canvas-header' closeButton>
          <Offcanvas.Title className='off-canvas-title'>GLIMPSE</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className='chat-side-area'>
          {/* <Col xs={3} className="d-flex flex-column chat-side-area"> */}
          <ChatSideAreaNavbar />
          <ChatSideAreaSearch />
          <ChatList {...props} />
          <ChatSideAreaNavBottom />
          {/* </Col> */}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
