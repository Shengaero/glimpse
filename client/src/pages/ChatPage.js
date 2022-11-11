import React from 'react';
import Chat from '../components/Chat';
import ChatSideArea from '../components/ChatSideArea';
import * as Auth from '../utils/auth';
import { Navigate } from 'react-router-dom';

export default function ChatPage() {

  if(!Auth.loggedIn()) {
    return <Navigate to="/" />;
  }

  return (
    <div className='d-flex chat-page'>
      <div className='d-flex h-100 w-100'>
        <ChatSideArea />
        <Chat />
      </div>
    </div>
  );
};
