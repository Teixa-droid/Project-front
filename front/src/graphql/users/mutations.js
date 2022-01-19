import { gql } from '@apollo/client';

const EDIT_USER = gql`
  mutation EditUser(
    $_id: String!
    $name: String!
    $lastname: String!
    $identification: String!
    $email: String!
    $state: Enum_UserState!
  ) {
    editUser(
      _id: $_id
      name: $name
      lastname: $lastname
      identification: $identification
      email: $email
      state: $state
    ) {
      _id
      name
      lastname
      email
      state
      identification
      rol 
    }
  }
`;

const EDIT_PROFILE = gql`
  mutation EditProfile($_id: String!, $fields: EditProfileFilter!) {
    editProfile(_id: $_id, fields: $fields) {
      _id
      name
      lastname
      identification
      picture 
    }
  }
`;

export { EDIT_USER, EDIT_PROFILE };