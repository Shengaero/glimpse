import React from 'react';
import Message from './Message';
import Text from './Text';

const Chat = () => {
  return (
    <div className='chat'>
      <div className="chatInfo">
        <span>Joe</span>
        <i class="bi bi-three-dots-vertical moreIcon"></i>
      </div>
      <Message />
      <Text />
    </div>
  );
};

export default Chat;
