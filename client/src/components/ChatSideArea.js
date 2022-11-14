import React, { useState } from 'react';
import ChatList from './ChatList';
import { Navbar, Col, Button, Nav, Dropdown } from 'react-bootstrap';
import * as Auth from '../utils/auth';
import { CreateChatModal, JoinChatModal } from './ChatFormModel';

function ChatSideAreaNavbar() {
  const [showCreateChat, setShowCreateChat] = useState(false);
  const [showJoinChat, setShowJoinChat] = useState(false);
  return (
    <Navbar expand={false} className="px-2 py-0">
      <span className="fw-bold">GLIMPSE</span>
      <Dropdown>
        <Dropdown.Toggle className='gear-icon'>
          <i className="bi bi-gear-fill gear-icon"></i>
        </Dropdown.Toggle>
        <Dropdown.Menu className='drop-menu' align="end">
          <Dropdown.Item className='drop-menu-text' onClick={() => setShowCreateChat(true)}>
            Create Chat
          </Dropdown.Item>
          <Dropdown.Item className='drop-menu-text' onClick={() => setShowJoinChat(true)}>
            Join Chat
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <CreateChatModal show={showCreateChat} setShow={setShowCreateChat} />
      <JoinChatModal show={showJoinChat} setShow={setShowJoinChat} />
    </Navbar>
  );
}

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
    <Button className="py-1 logout-btn" onClick={() => {
      Auth.logout();
    }}>
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
