import useReferendumVotingFinishHeight, {
  useReferendaIsVoting,
} from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { useRelayChainBlockNumber } from "next-common/utils/gov2/useRealyChainBlockNumber";

export function useRelayChainBlockState() {
  const blockHeight = useReferendumVotingFinishHeight();
  const isVoting = useReferendaIsVoting();
  const { relayChainBlockNumber } = useRelayChainBlockNumber(blockHeight);

  return {
    blockHeight,
    isVoting,
    relayChainBlockNumber,
  };
}
