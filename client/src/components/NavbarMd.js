import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import '../styles/NavbarMd.scss'

export default function NavbarMd(){
    return (
        <Navbar fixed='top' className='md-navbar'>
            <Navbar.Brand className='navbar-brand'>GLIMPSE</Navbar.Brand>
        </Navbar>
    )
}
