// 

import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  query LoginUser($email: String!, $password: String!) {
    users(where: { email: { _eq: $email }, password: { _eq: $password } }) {
      id
      email
      password
    }
  }
`;