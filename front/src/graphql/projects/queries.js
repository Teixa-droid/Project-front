import { gql } from '@apollo/client';

const PROJECTS = gql`
query Projects {
  Projects {
    _id
    name
    status
    objectives {
      _id
      description
      type
    }
    leader{
      _id
      email
    }
    inscriptions {
      status
      student {
        _id
      }
    }
  }
}
`;

export { PROJECTS };