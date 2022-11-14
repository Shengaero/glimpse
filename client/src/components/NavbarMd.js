import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import ChatList from './ChatList';
import { Navbar, Button, Offcanvas, ListGroup } from 'react-bootstrap';
import * as Auth from '../utils/auth';
import CreateChatModal from './CreateChatModal';

export default function NavbarMd(props) {
    const [showCreateChat, setShowCreateChat] = useState(false);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <Navbar fixed='top' className='md-navbar'>
            <Container fluid>
                <Navbar.Brand className='navbar-brand'>GLIMPSE</Navbar.Brand>
                <Button className='off-canvas-btn' onClick={handleShow}>
                    <i className="bi bi-gear-fill"></i>
                </Button>
                <Offcanvas className='off-canvas-main' show={show} onHide={handleClose}>
                    <Offcanvas.Header className='off-canvas-header'>
                        <i className="bi bi-x-lg close-btn" onClick={handleClose}></i>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <ListGroup className='list-group-canvas'>
                            <ListGroup.Item className='create-chat' onClick={() => setShowCreateChat(true)}>Create Chat</ListGroup.Item>
                            <ListGroup.Item>
                                <ChatList {...props} />
                            </ListGroup.Item>
                            <ListGroup.Item onClick={() => { Auth.logout() }}>Logout</ListGroup.Item>
                        </ListGroup>
                    </Offcanvas.Body>
                </Offcanvas>
                <CreateChatModal show={showCreateChat} setShow={setShowCreateChat} />
            </Container>
        </Navbar>
    )
}
