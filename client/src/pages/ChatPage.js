import React from 'react';
import Chat from '../components/Chat';
import Sidebar from '../components/Sidebar';

export const ChatPage = () => {
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
