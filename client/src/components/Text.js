import React from 'react';

const Text = () => {
  return (
    <div className='text'>
      <input type='text' placeholder='Type a message...' />
      <button className='sendBtn'>Send</button>
    </div>
  );
};

export default Text;
