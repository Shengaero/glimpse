import { gql } from '@apollo/client';

export const GET_ME = gql`
  query me {
    me {
      _id
      name
      chats {
        _id
        name
        messages {
          _id
          content
          author {
            _id
          }
          createdAt
        }
      }
    }
  }
`;

export const GET_USER = gql`
  query user($id: ID!) {
    user(id: $id) {
      _id
      name
    }
  }
`;

export const GET_CHAT = gql`
  query chat($chatId: ID!) {
    chat(id: $chatId) {
      _id
      name
      owner {
        _id
      }
      users {
        _id
        name
      }
      messages {
        _id
        content
        author {
          _id
        }
        createdAt
      }
    }
  }
`;
