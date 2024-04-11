import { gql } from "@apollo/client";

const DAILY_EXTRINSICS_QUERY = gql`
  query MyQuery {
    dailyExtrinsics {
      count
      startHeight
      startTime
    }
  }
`;

export { DAILY_EXTRINSICS_QUERY };
