import { gql } from '@apollo/client';

const EDIT_PROJECT = gql`
mutation Mutation($_id: String!, $fields: projectFields!) {
  editProject(_id: $_id, fields: $fields) {
    _id
    status
  }
}
`;

const CREATE_PROJECT = gql`
mutation CreateProject(
  $name: String!, 
  $assumption: Float!, 
  $startdate: Date!, 
  $enddate: Date!, 
  $leader: String!, 
  $objectives: [createObjective]
  ) {
  createProject(
    name: $name, 
    assumption: $assumption, 
    startdate: $startdate, 
    enddate: $enddate, 
    leader: $leader, 
    objectives: $objectives
    ) {
    _id
  }
}
`;

export { EDIT_PROJECT, CREATE_PROJECT };