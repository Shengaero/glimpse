import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import Chat from '../components/Chat';
import ChatSideArea from '../components/ChatSideArea';
import ChatWebSocketProvider from '../components/ChatWebSocket';
import { GET_ME } from '../utils/queries';
import * as Auth from '../utils/auth';
import { Navigate } from 'react-router-dom';

const WS_URL = `${process.env.NODE_ENV === 'production' ? `wss://${window.location.host}` : 'ws://localhost:3001'}/chat`;

export default function ChatPage() {
  const { data } = useQuery(GET_ME, {
  });
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);

  const handleNewMessage = ({ chatId, msg, userId, createdAt }) => {
    // if the chatId the of the message matches the ID of the currently viewed chat
    if(chatId === chat?._id) {
      // find the index of the user that is sending the message
      const i = chat.users.findIndex(({ _id }) => _id === userId);
      // construct a new message object
      const newMessage = {
        content: msg,
        author: chat.users[i],
        createdAt: createdAt
      };
      // set messages with the new message at the top
      setMessages([newMessage, ...messages]);
    } else {
      // TODO: Handle message sent in channel not currently viewing
    }
  };

  useEffect(() => {
    // if the data is available and there is no current chat sent
    if(data && !chat) {
      // get the first chat
      const currentChat = data.me.chats[0]; // TODO: maybe set a chat ID in localhost and remember it?
      // if the user has no chats, do not set this
      if(currentChat) {
        // set it as the current viewed chat
        setChat(currentChat);
      }
    }
  }, [data, chat, setChat]);

  if(!Auth.loggedIn()) {
    return <Navigate to="/" />;
  }

  // if the data hasn't come in yet
  if(!data) {
    return <div>Loading</div>; // FIXME: Something that looks better.
  }

  return (
    <div className='d-flex chat-page'>
      <div className='d-flex h-100 w-100'>
        <ChatWebSocketProvider
          wsURL={WS_URL}
          handleNewMessage={handleNewMessage}
        >
          <ChatSideArea
            chats={data.me.chats}
            currentChat={chat}
            setChat={(chat) => {
              setChat(chat);
              setMessages([]);
            }}
          />
          {chat ? (
            <Chat
              userId={data.me._id}
              chatId={chat._id}
              messages={messages}
              setMessages={setMessages}
            />
          ) : (
            <div>Loading...</div> // FIXME: add a default element for when there is no chat viewable
          )}
        </ChatWebSocketProvider>
      </div>
    </div>
  );
};
