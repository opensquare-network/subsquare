import { gql } from "@apollo/client";

export const PRICES_GQL = gql`
  query MyQuery($timeRange: TimeRange!) {
    prices(timeRange: $timeRange) {
      price
      time
    }
  }
`;
