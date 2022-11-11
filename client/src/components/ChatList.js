import React from 'react';

const ChatListItem = (props) => (
  <li className="chat-list-item align-items-center p-2">
    <span className="item-name">{props.chatName}</span>
    <p className="item-message my-auto">{props.lastMessage}</p>
  </li>
);

export default function ChatList() {
  return (
    <div className="d-flex flex-column flex-fill chat-list">
      <ol className="ps-0 py-0 mb-0 flex-fill">
        <ChatListItem chatName="Joe" lastMessage="What's good" />
        <ChatListItem chatName="Emily" lastMessage="Hey" />
        <ChatListItem chatName="Tom" lastMessage="Sup" />
        <ChatListItem chatName="Joe" lastMessage="What's good" />
        <ChatListItem chatName="Emily" lastMessage="Hey" />
        <ChatListItem chatName="Tom" lastMessage="Sup" />
        <ChatListItem chatName="Joe" lastMessage="What's good" />
        <ChatListItem chatName="Emily" lastMessage="Hey" />
        <ChatListItem chatName="Tom" lastMessage="Sup" />
        <ChatListItem chatName="Joe" lastMessage="What's good" />
        <ChatListItem chatName="Emily" lastMessage="Hey" />
        <ChatListItem chatName="Tom" lastMessage="Sup" />
        <ChatListItem chatName="Joe" lastMessage="What's good" />
        <ChatListItem chatName="Emily" lastMessage="Hey" />
        <ChatListItem chatName="Tom" lastMessage="Sup 1" />
      </ol>
    </div>
  );
};
