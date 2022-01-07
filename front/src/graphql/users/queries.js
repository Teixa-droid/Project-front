import { gql } from "@apollo/client";

const GET_USERS = gql`
query Users {
  Users {
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
const GET_USER = gql`
query User($_id: String!) {
  User(_id: $_id) {
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


export {GET_USERS, GET_USER} ;