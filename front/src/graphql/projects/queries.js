import { gql } from '@apollo/client';

const PROJECTS = gql`
query Projects {
  Projects {
    _id
    name
    status
    objectives {
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