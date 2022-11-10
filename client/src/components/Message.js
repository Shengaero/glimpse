import React from 'react';

const Message = () => {
  return (
    <div className='messages'>
      <div className="message">
        <div className="user1">
          <p className='userName'>
            Joe
          </p>
        <div className="messageText">
          <p>
            Hello World
          </p>
        </div>
        </div>
        <div className="messageTime">
          <span>1:04PM</span>
        </div>
      </div>
    </div>
  );
};

export default Message;
