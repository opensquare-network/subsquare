import { useOnchainData } from "../../context/post";
import { useSelector } from "react-redux";
import { inactiveIssuanceSelector } from "../../store/reducers/referenda/issuance";
import useReferendumVotingFinishHeight from "../../context/post/referenda/useReferendumVotingFinishHeight";

export default function useReferendaIssuance() {
  const onchain = useOnchainData();
  const tally = onchain.tally || onchain?.info?.tally;
  const issuanceByScan = tally.electorate;
  const onchainIssuance = useSelector(inactiveIssuanceSelector);
  const finishedHeight = useReferendumVotingFinishHeight();

  return finishedHeight ? issuanceByScan : issuanceByScan || onchainIssuance;
}
