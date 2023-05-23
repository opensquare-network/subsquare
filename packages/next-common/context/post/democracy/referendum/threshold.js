import { useOnchainData } from "../../index";

export default function useDemocracyThreshold() {
  const onchain = useOnchainData();
  if (onchain.meta) {
    return onchain.meta.threshold;
  }

  if (onchain.status) {
    return onchain.status.threshold;
  }

  if (onchain.info?.ongoing) {
    return onchain.info.ongoing.threshold;
  }

  throw new Error(`Can not get voting threshold of referendum ${ onchain.referendumIndex }`);
}
