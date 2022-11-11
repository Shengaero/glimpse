import React from 'react';
import ChatList from './ChatList';
import { Navbar, Col, Button, Nav, Dropdown} from 'react-bootstrap';

const ChatSideAreaNavbar = () => (
  <Navbar expand={false} className="px-2 py-0">
    <span className="fw-bold">GLIMPSE</span>
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
    <Button className="py-0">
      Logout
    </Button>
  </Nav>
);

export default function ChatSideArea(props) {
  return (
    <Col xs={3} className="d-flex flex-column chat-side-area">
      <ChatSideAreaNavbar />
      <ChatSideAreaSearch />
      <ChatList {...props} />
      <ChatSideAreaNavBottom />
    </Col>
  );
};
