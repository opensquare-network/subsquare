import { gql } from "@apollo/client";

const BASIC_DATA_QUERY = gql`
  query MyQuery {
    basicData {
      cfgPrice
      holders {
        all
        whales
        dolphins
      }
      rewards {
        total
        collator
        treasury
      }
      supply {
        total
        wrapped
      }
      treasuryTokens {
        price
        token
        value
      }
      governanceToken {
        onChain
        onChainPercentage
        offChain
      }
      signedExtrinsicCount
    }
  }
`;

export { BASIC_DATA_QUERY };
