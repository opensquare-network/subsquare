import { useOnchainData } from "../../index";

export default function useDemocracyMeta() {
  const onchain = useOnchainData();
  if (onchain.meta) {
    return onchain.meta;
  }

  if (onchain.status) {
    return onchain.status;
  }

  if (onchain.info?.ongoing) {
    return onchain.info.ongoing;
  }

  throw new Error(`Can not get meta of referendum ${ onchain.referendumIndex }`);
}
