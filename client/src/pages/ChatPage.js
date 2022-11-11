import React from 'react';
import Chat from '../components/Chat';
import ChatSideArea from '../components/ChatSideArea';

export default function ChatPage() {
  return (
    <div className='d-flex chat-page'>
      <div className='d-flex h-100 w-100'>
        <ChatSideArea />
        <Chat />
      </div>
    </div>
  );
};
