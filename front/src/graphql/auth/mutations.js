import { gql } from "@apollo/client";

const REGISTRATION = gql`
mutation Registration(
    $name: String!
    $lastname: String!
    $identification: String!
    $email: String!
    $rol: Enum_Rol!
    $password: String!
    ) {
  registration(
      name: $name
      lastname: $lastname
      identification: $identification
      email: $email
      rol: $rol
      password: $password
      ){
        token
        error
      }
}
`;

const LOGIN = gql`
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    error
  }
}
`;

const REFRESH_TOKEN = gql`
mutation RefreshToken {
  refreshToken {
    token
    error
  }
}
`;

export { REGISTRATION, LOGIN, REFRESH_TOKEN };