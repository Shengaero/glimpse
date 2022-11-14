import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import ChatList from './ChatList';
import { Navbar, Col, Button, Nav, Dropdown, Offcanvas, ListGroup } from 'react-bootstrap';
import * as Auth from '../utils/auth';
import CreateChatModal from './CreateChatModal';

export default function NavbarMd() {
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
            <Offcanvas className='off-canvas' show={show} onHide={handleClose} placement='end'>
                <Offcanvas.Header className='off-canvas-header'>
                    <i className="bi bi-x-lg close-btn" onClick={handleClose}></i>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <ListGroup className='list-group-canvas'>
                        <ListGroup.Item className='create-chat' onClick={() => setShowCreateChat(true)}>Create Chat</ListGroup.Item>
                        <ListGroup.Item>Chats</ListGroup.Item>
                        <ListGroup.Item onClick={() => {Auth.logout()}}>Logout</ListGroup.Item>
                    </ListGroup>
                </Offcanvas.Body>
            </Offcanvas>
            <CreateChatModal show={showCreateChat} setShow={setShowCreateChat} />
            </Container>
        </Navbar>
    )
}

// function ChatSideAreaNavbar() {
//   const [showCreateChat, setShowCreateChat] = useState(false);
//   const [show, setShow] = useState(false);

//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);
//   return (
//     <Navbar expand={false} className="px-2 py-0">
//       <span className="fw-bold">GLIMPSE</span>
//       <Button className='off-canvas-btn' onClick={handleShow}>
//         <i className="bi bi-gear-fill"></i>
//       </Button>
//       <Offcanvas className='off-canvas' show={show} onHide={handleClose}>
//         <Offcanvas.Header className='off-canvas-header'>
//         <i className="bi bi-x-lg close-btn" onClick={handleClose}></i>
//         </Offcanvas.Header>
//         <Offcanvas.Body>
//           <ListGroup className='list-group-canvas'>
//             <ListGroup.Item className='create-chat' onClick={() => setShowCreateChat(true)}>Create Chat</ListGroup.Item>
//             <ListGroup.Item>Placeholder</ListGroup.Item>
//             <ListGroup.Item>Placeholder</ListGroup.Item>
//           </ListGroup>
//         </Offcanvas.Body>
//       </Offcanvas>
//       <CreateChatModal show={showCreateChat} setShow={setShowCreateChat} />
//     </Navbar>
//   );
// }

// const ChatSideAreaSearch = () => (
//   <div className="search">
//     <div className="search-form">
//       <input type="text" placeholder="Search" />
//     </div>
//   </div>
// );

// const ChatSideAreaNavBottom = () => (
//   <Nav as="nav" className="nav-bottom px-2">
//     <div>
//       <img src='' alt='' />
//       <span className="user">User</span>
//     </div>
//     <Button className="py-0" onClick={() => {
//       Auth.logout();
//     }}>
//       Logout
//     </Button>
//   </Nav>
// );

// export default function ChatSideArea(props) {
//   return (
//     <Col xs={3} className="d-flex flex-column chat-side-area">
//       <ChatSideAreaNavbar />
//       <ChatSideAreaSearch />
//       <ChatList {...props} />
//       <ChatSideAreaNavBottom />
//     </Col>
//   );
// };
