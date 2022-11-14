import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Col, Navbar, Button, Dropdown} from 'react-bootstrap';

import { useChatWebSocket } from './ChatWebSocket';
import { GET_CHAT } from '../utils/queries';

// FIXME: This needs to look wayyyyyy better
const ChatMessage = ({ author, content, createdAt }) => (
  <div className="message">
    <div className="message-stub">
      <span className="message-user">{author.name}</span>
      <div className="message-time">
        <span>{createdAt}</span>
      </div>
    </div>
    <div className="message-text">
      <p>{content}</p>
    </div>
  </div>
);

const ChatMessageArea = ({ messages }) => {
  // create a ref to help us with scrolling to bottom of chat
  const newestMessageRef = useRef(null);
  // this will make it so we always scroll to the bottom when messages changes
  useEffect(() => newestMessageRef.current?.scrollIntoView(), [messages]);
  // render message elements
  const messageElements = messages.map((message, index) => (
    <ChatMessage
      key={`message-${index}`}
      author={message.author}
      content={message.content}
      createdAt={message.createdAt}
    />
  ));
  // render component
  return (
    <div className='d-flex flex-column-reverse flex-fill px-2 message-area'>
      <div ref={newestMessageRef} />
      {messageElements}
    </div>
  );
};

const ChatTextArea = ({ chatId }) => {
  // use out ChatWebSocket context
  const { cws } = useChatWebSocket();
  // text state for the content of the text area
  const [text, setText] = useState('');
  // handler for when the user changes the content
  // sets the text state to the value of the text area
  const handleContentChange = ({ target }) => setText(target.value);
  // handler for sending message
  const handleSendMessage = () => {
    try { // try to send via ChatWebSocket
      cws.send(text, chatId);
    } catch(err) {
      // log if we get an error
      console.log(err);
    }
    // reset message box
    setText('');
  };

  return (
    <div className='text-area px-2'>
      <input
        type='text'
        placeholder='Type a message...'
        value={text}
        onChange={handleContentChange}
      />
      <Button
        // this will keep the button disabled as long as the text area is empty
        disabled={text.trim().length < 1}
        className='send-btn py-0'
        onClick={handleSendMessage}
      >Send</Button>
    </div>
  );
};

export default function Chat({ chatId, messages, setMessages }) {
  const { data } = useQuery(GET_CHAT, {
    variables: { chatId: chatId },
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    // if the data is available and there are no messages yet
    if(data && messages.length < 1)
      // set the messages as the preexisting ones
      setMessages(data.chat.messages);
  }, [data, messages, setMessages]);

  return (
    <Col className="d-flex flex-column chat">
      <Navbar expand={false} className="py-0 px-2">
        <span>
          {data?.chat?.name || 'Loading...'} {/* FIXME: Make this look better while loading */}
        </span>
        <Dropdown>
          <Dropdown.Toggle >
            <i className="bi bi-three-dots-vertical"></i>
          </Dropdown.Toggle>
          <Dropdown.Menu align="end">
            <Dropdown.Item href="#/action-1">Test</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Test</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Test</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Navbar>
      {data ? (
        <>
          <ChatMessageArea messages={messages} />
          <ChatTextArea chatId={chatId} />
        </>
      ) : (
        <div>Loading...</div>
      )}
    </Col>
  );
};
