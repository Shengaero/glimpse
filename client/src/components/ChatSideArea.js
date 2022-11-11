import React from 'react';
import ChatList from './ChatList';
import { Navbar, Col, Button, Nav } from 'react-bootstrap';

const ChatSideAreaNavbar = () => (
  <Navbar expand={false} className="px-2 py-0">
    <span className="fw-bold">GLIMPSE</span>
    <i className="bi bi-gear-fill"></i>
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

export default function ChatSideArea() {
  return (
    <Col xs={3} className="d-flex flex-column chat-side-area">
      <ChatSideAreaNavbar />
      <ChatSideAreaSearch />
      <ChatList />
      <ChatSideAreaNavBottom />
    </Col>
  );
};
