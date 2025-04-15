import { gql } from "@apollo/client";

export const GET_IDENTITIES = gql`
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
