import { fetchCoretimeChainHeight } from "next-common/services/fetchScanHeight";
import queryCoretimeConfiguration from "next-common/services/gql/coretime/configuration";
import queryCoretimeStatus from "next-common/services/gql/coretime/status";

export default async function getCoretimeCommonProps() {
  const coretimeScanHeight = await fetchCoretimeChainHeight();
  const configuration = await queryCoretimeConfiguration();
  const status = await queryCoretimeStatus();

  return {
    props: {
      coretimeScanHeight: coretimeScanHeight ?? null,
      configuration: configuration ?? null,
      status: status ?? null,
    },
  };
}
