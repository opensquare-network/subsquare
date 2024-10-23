import { coretimeClient } from "next-common/hooks/apollo";
import { gql } from "@apollo/client";

const GET_CORETIME_STATUS = gql`
  query MyQuery {
    coretimeStatus {
      coreCount
      privatePoolSize
      systemPoolSize
      lastCommittedTimeslice
      lastTimeslice
    }
  }
`;

export default async function queryCoretimeStatus() {
  const {
    data: { coretimeStatus = null },
  } =
  (await coretimeClient?.query?.({
    query: GET_CORETIME_STATUS,
  })) || {};

  return coretimeStatus;
}
