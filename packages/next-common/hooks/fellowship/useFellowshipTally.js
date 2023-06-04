import { useOnchainData } from "../../context/post";
import { useSelector } from "react-redux";
import { fellowshipReferendumTallySelector } from "../../store/reducers/fellowship/tally";

export default function useFellowshipTally() {
  const onchain = useOnchainData();
  const scanTally = onchain.tally || onchain?.info?.tally; // tally from scan
  const maybeOnChainTally = useSelector(fellowshipReferendumTallySelector);

  return maybeOnChainTally || scanTally;
}
