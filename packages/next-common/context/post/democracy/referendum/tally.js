import { useOnchainData } from "../../index";

export default function useDemocracyTally() {
  const onchain = useOnchainData();
  if (onchain.tally) {
    return onchain?.tally;
  }

  if (onchain.info?.ongoing) {
    return onchain.info?.ongoing?.tally;
  }

  if (onchain.status) {
    return onchain.status?.tally;
  }
}
