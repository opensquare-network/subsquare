import { coretimeClient } from "next-common/hooks/apollo";
import { gql } from "@apollo/client";

const GET_CORETIME_SCAN_HEIGHT = gql`
  query MyQuery {
    coretimeScanHeight
  }
`;

export default async function queryCoretimeScanHeight() {
  const {
    data: { coretimeScanHeight = null },
  } =
  (await coretimeClient?.query?.({
    query: GET_CORETIME_SCAN_HEIGHT,
  })) || {};

  return coretimeScanHeight;
}
