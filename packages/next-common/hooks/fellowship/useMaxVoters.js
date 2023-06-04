import { useOnchainData } from "../../context/post";
import { useSelector } from "react-redux";
import { maxVotersSelector } from "../../store/reducers/fellowship/maxVoters";

export default function useMaxVoters() {
  const onchain = useOnchainData();
  const scanTally = onchain.tally || onchain?.info?.tally; // tally from scan
  const maybeOnChain = useSelector(maxVotersSelector);

  return maybeOnChain || scanTally.electorate || 0;
}
