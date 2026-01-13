import { coretimeClient } from "next-common/hooks/apollo";
import { gql } from "@apollo/client";
import { CORETIME_CONFIGURATION_FIELDS } from "next-common/services/gql/coretime/common";

const GET_CORETIME_CONFIGURATION = gql`
  query MyQuery {
    coretimeConfiguration {
      ${CORETIME_CONFIGURATION_FIELDS}
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
