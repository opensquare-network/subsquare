import { gql } from "@apollo/client";

export const coretimeCurrentSale = gql`
  query MyQuery {
    coretimeCurrentSale {
      id
    }
  }
`;
