import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { CREATE_CHAT, JOIN_CHAT } from '../utils/mutations';
import { GET_ME } from '../utils/queries';

export function CreateChatModal({ show, setShow }) {
  const [chatName, setChatName] = useState('');
  const [createChat] = useMutation(CREATE_CHAT, {
    update(cache, { data: { createChat } }) {
      try {
        const { me } = cache.readQuery(GET_ME);
        cache.writeQuery({
          query: GET_ME,
          data: { me: { ...me, chats: [createChat, ...me.chats] } }
        });
      } catch(err) {
        console.log(err);
      }
    }
  });

  const onChatNameChange = ({ target }) => setChatName(target.value);
  const handleCreateChat = async (event) => {
    event.preventDefault();
    try {
      await createChat({
        variables: { name: chatName.trim() }
      });

      setChatName('');

      // Reload the chat
      // Unfortunately until I can find a better solution to updating
      //the websocket to listen to the new chat, this will have to do.
      window.location.reload();
    } catch(err) {
      console.log(err);
    }
  };

  return (
    <ChatModal
      show={show}
      setShow={setShow}
      title="Create Chat"
      disableIf={chatName.trim().length < 1}
      onConfirm={handleCreateChat}
      accept="Create"
    >
      <Form onSubmit={(event) => event.preventDefault()}>
        <Form.Group>
          <Form.Label>Chat Name</Form.Label>
          <Form.Control
            type="none"
            value={chatName}
            onChange={onChatNameChange}
            placeholder="The coolest chat ever!"
          />
        </Form.Group>
      </Form>
    </ChatModal>
  );
}

export function JoinChatModal({ show, setShow }) {
  const [chatId, setChatId] = useState('');
  const [joinChat] = useMutation(JOIN_CHAT, {
    update(cache, { data: { joinChat } }) {
      try {
        const { me } = cache.readQuery(GET_ME);
        cache.writeQuery({
          query: GET_ME,
          data: { me: { ...me, chats: [joinChat, ...me.chats] } }
        });
      } catch(err) {
        console.log(err);
      }
    }
  });


  const onChatIdChange = ({ target }) => setChatId(target.value);
  const handleJoinChat = async (event) => {
    event.preventDefault();
    try {
      await joinChat({
        variables: { chatId: chatId.trim() }
      });

      setChatId('');

      // Reload the chat
      // Unfortunately until I can find a better solution to updating
      //the websocket to listen to the new chat, this will have to do.
      window.location.reload();
    } catch(err) {
      console.log(err);
    }
  };

  return (
    <ChatModal
      show={show}
      setShow={setShow}
      title="Join Chat"
      disableIf={chatId.trim().length < 1}
      onConfirm={handleJoinChat}
      accept="Join"
    >
      <Form onSubmit={(event) => event.preventDefault()}>
        <Form.Group>
          <Form.Label>Chat ID</Form.Label>
          <Form.Control
            type="none"
            value={chatId}
            onChange={onChatIdChange}
            placeholder="Enter a chat ID here..."
          />
        </Form.Group>
      </Form>
    </ChatModal>
  );
}

export const ChatModal = ({
  show,
  setShow,
  title,
  disableIf,
  onConfirm,
  accept,
  children
}) => (
  <Modal show={show} onHide={() => setShow(false)} enforceFocus={false} centered>
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {children}
    </Modal.Body>
    <Modal.Footer>
      <Button disabled={disableIf} onClick={onConfirm} >
        {accept ? accept : 'Accept'}
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ChatModal;
