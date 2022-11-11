import React from 'react';
import { Navigate } from 'react-router-dom';
import Chat from '../components/Chat';
import Sidebar from '../components/Sidebar';
import * as Auth from '../utils/auth';

export const ChatPage = () => {
  if(!Auth.loggedIn()) {
    return <Navigate to="/" />;
  }

  return (
    <div className='chat-page'>
      <div className='chat-container'>
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
};

export default ChatPage;
