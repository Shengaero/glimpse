import React from 'react';

const SideChat = () => {
  return (
    <div className='sidechat '>
      <div className="userChats">
        <div className="userChatsInfo">
          <span>Joe</span>
          <p>What's good</p>
        </div>
      </div>
      <div className="userChats">
        <div className="userChatsInfo">
          <span>Emily</span>
          <p>Hey</p>
        </div>
      </div>
      <div className="userChats">
        <div className="userChatsInfo">
          <span>Tom</span>
          <p>Sup</p>
        </div>
      </div>
    </div>
  );
};

export default SideChat;
