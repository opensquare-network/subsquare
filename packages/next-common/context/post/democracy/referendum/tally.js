import { useOnchainData } from "../../index";

export default function useDemocracyTally() {
  const onchain = useOnchainData();
  return onchain?.tally;
}
