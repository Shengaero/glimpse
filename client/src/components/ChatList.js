import React from 'react';

function ChatListItem({ isCurrent, chat, setChat }) {
  const handleOnClick = (event) => {
    event.preventDefault();
    // only set chat if it's not the current one
    if(!isCurrent) {
      setChat(chat);
    }
  };

  return (
    <li className="chat-list-item align-items-center p-2" onClick={handleOnClick}>
      <span className="item-name">{chat.name}</span>
    </li>
  );
}

export default function ChatList({ chats, currentChat, setChat }) {
  return (
    <div className="d-flex flex-column flex-fill chat-list">
      <ol className="ps-0 py-0 mb-0 flex-fill">
        {chats.map((chat, index) => (
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
