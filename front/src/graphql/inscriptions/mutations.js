import { gql } from '@apollo/client'

const CREATE_INSCRIPTION = gql`
mutation Mutation($project: String!, $student: String!) {
  createInscription(project: $project, student: $student) {
    _id
  }
}
`;

const APROVE_REGISTER = gql`
mutation ApproveRegistration($approveRegistrationId: String!) {
  approveRegistration(id: $approveRegistrationId) {
    _id
  }
}
`;

export { CREATE_INSCRIPTION, APROVE_REGISTER };