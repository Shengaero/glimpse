import React from 'react';
import { useMutation } from '@apollo/client';
import { LEAVE_CHAT } from '../utils/mutations';

function ChatListItem({ isCurrent, chat, setChat }) {
  const [leaveChat] = useMutation(LEAVE_CHAT);


  const handleOnClick = (event) => {
    event.preventDefault();
    // only set chat if it's not the current one
    if (!isCurrent) {
      setChat(chat);
    }
  };
  const handleLeaveChat = async (chatId) => {
    try {
      await leaveChat({
        variables: { chatId }
      });

      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <li className="chat-list-item align-items-center justify-items-between p-2" onClick={handleOnClick}>
      <span className="item-name mr-auto">{chat.name}</span>
      <button
        className="btn btn-sm btn-danger ml-auto"
        onClick={() => handleLeaveChat(chat._id)}
      >
        Leave Chat
      </button>
    </li>
  );
}

export default function ChatList({ chats, currentChat, setChat }) {
  return (
    <div className="d-flex flex-column flex-fill chat-list">
      <ol className="ps-0 py-0 mb-0 flex-fill">
        {chats?.map((chat, index) => (
          <ChatListItem
            key={`chat-${index}`}
            isCurrent={chat._id === currentChat._id} // TODO: Do something with this
            chat={chat}
            setChat={setChat}
          />
        ))}
      </ol>
    </div>
  );
};
