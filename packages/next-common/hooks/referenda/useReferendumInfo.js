import { useOnchainData } from "next-common/context/post";
import { useSelector } from "react-redux";
import { referendumInfoSelector } from "next-common/store/reducers/referenda/info";
import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";

export function useReferendumInfo() {
  const onchain = useOnchainData();
  const infoOnStore = useSelector(referendumInfoSelector);

  return infoOnStore || onchain.info;
}

export function useDecisionDeposit() {
  const info = useReferendumInfo();
  return info?.decisionDeposit;
}

export function useReferendumTally() {
  const onchain = useOnchainData();
  const infoOnStore = useSelector(referendumInfoSelector);
  const votingFinishHeight = useReferendumVotingFinishHeight();

  if (votingFinishHeight && onchain.tally) {
    return onchain.tally;
  } else if (!votingFinishHeight && infoOnStore) {
    return infoOnStore.tally;
  } else {
    return onchain.tally || onchain.info.tally;
  }
}
