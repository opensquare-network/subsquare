import { gql } from "@apollo/client";

export const GET_IDENTITIES = gql`
  query GetIdentities($limit: Int!, $offset: Int!, $search: String) {
    identities(limit: $limit, offset: $offset, search: $search) {
      limit
      offset
      total
      identities {
        subsCount
        account
        isSub
        lastUpdate {
          blockTime
        }
      }
    }
  }
`;

export const GET_IDENTITIES_COUNT = gql`
  query GetIdentities(
    $limit: Int!
    $offset: Int!
    $search: String
    $identityType: IdentitySubType
    $verificationStatus: VerificationStatus
  ) {
    identities(
      limit: $limit
      offset: $offset
      search: $search
      identityType: $identityType
      verificationStatus: $verificationStatus
    ) {
      total
    }
  }
`;

export const GET_IDENTITIES_REGISTRARS = gql`
  query GetRegistrars {
    identityRegistrars {
      account
      statistics {
        given
        request
        lastGivenIndexer {
          blockTime
        }
        __typename
      }
    }
  }
`;
