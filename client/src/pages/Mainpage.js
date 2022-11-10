import React from 'react';
import Chat from '../components/Chat';
import Sidebar from '../components/Sidebar';

export const Mainpage = () => {
  return (
    <div className='mainpage'>
      <div className='container'>
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
};

export default Mainpage;
