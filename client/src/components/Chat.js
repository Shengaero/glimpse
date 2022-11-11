import React, { useEffect, useRef, useState } from 'react';
import {Col, Navbar, Button, Dropdown, SplitButton} from 'react-bootstrap';

const ChatMessage = () => (
  <div className="message">
    <div className="message-stub">
      <p className="message-user">
        Joe
      </p>
      <div className="message-text">
        <p>
          Hello World
        </p>
      </div>
    </div>
    <div className="message-time">
      <span>1:04PM</span>
    </div>
  </div>
);

const ChatMessageArea = () => {
  const bottomRef = useRef(null);
  const [messages] = useState([0]);

  // this will make it so we always scroll to the bottom when messages changes
  useEffect(() => bottomRef.current?.scrollIntoView(), [messages]);

  return (
    <div className='d-flex flex-column flex-fill px-2 message-area'>
      {messages.map(message => <ChatMessage />)} {/* TODO: Hook up websocket */}
      <div ref={bottomRef} />
    </div>
  );
};

const ChatTextArea = () => {
  return (
    <div className='text-area px-2'>
      <input type='text' placeholder='Type a message...' />
      <Button className='send-btn py-0'>Send</Button>
    </div>
  );
};

export default function Chat() {
  return (
    <Col className="d-flex flex-column chat">
      <Navbar expand={false} className="py-0 px-2">
        <span>Joe</span>
        <Dropdown>
          <Dropdown.Toggle >
            <i className="bi bi-three-dots-vertical"></i>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">Test</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Test</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Test</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Navbar>
      <ChatMessageArea />
      <ChatTextArea />
    </Col>
  );
};
