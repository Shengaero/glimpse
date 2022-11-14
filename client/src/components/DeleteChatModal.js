import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { CREATE_CHAT } from '../utils/mutations';
import { GET_ME } from '../utils/queries';

export default function CreateChatModal({ show, setShow }) {
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
        variables: { name: chatName }
      });

      setChatName('');
    } catch(err) {
      console.log(err);
    }
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} enforceFocus={false} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create Chat</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
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
      </Modal.Body>
      <Modal.Footer>
        <Button
          disabled={chatName.trim().length < 1}
          onClick={handleCreateChat}
        >
          Create Chat
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
