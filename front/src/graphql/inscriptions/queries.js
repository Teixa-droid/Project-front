import { gql } from '@apollo/client';

const GET_INSCRIPTIONS = gql`
query Inscriptions {
  Inscriptions {
    _id
    status
    student {
      _id
      name
      lastname
      email
    }
    project {
      _id
      name
      leader {
        _id
      }
    }
  }
}
`;

export { GET_INSCRIPTIONS };