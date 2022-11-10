import React from 'react';
import BottomNav from './BottomNav';
import SideChat from './Sidechat';
import Navbar from './Navbar';
import Search from './Search';

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <Navbar />
      <Search />
      <SideChat />
      <BottomNav />
    </div>
  );
};

export default Sidebar;
