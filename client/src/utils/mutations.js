import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation createUser($name: String!, $email: String!, $password: String!) {
    createUser(name: $name, email: $email, password: $password) {
        token
        user {
            _id
            name
        }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
        token
        user {
            _id
            name
      }
    }
  }
`;

export const CREATE_CHAT = gql`
  mutation createChat($name: String!) {
    createChat(name: $name) {
        _id
        name
        owner {
          _id
        }
        users {
          _id
        }
    }
  }
`;
