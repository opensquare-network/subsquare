import { coretimeClient } from "next-common/hooks/apollo";
import { gql } from "@apollo/client";

const GET_CORETIME_CONFIGURATION = gql`
  query MyQuery {
    coretimeConfiguration {
      advanceNotice
      interludeLength
      leadinLength
      regionLength
      idealBulkProportion
      limitCoresOffered
      renewalBump
      contributionTimeout
    }
  }
`;

export default async function queryCoretimeConfiguration() {
  const {
    data: { coretimeConfiguration = null },
  } =
  (await coretimeClient?.query?.({
    query: GET_CORETIME_CONFIGURATION,
  })) || {};

  return coretimeConfiguration;
}
