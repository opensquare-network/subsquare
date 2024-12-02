import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useContextApi } from "next-common/context/api";
import { useChain } from "next-common/context/chain";
import { useCollectivePallet } from "next-common/context/collective";
import Chains from "next-common/utils/consts/chains";
import useCollectiveMembers from "next-common/utils/hooks/collectives/useCollectiveMembers";
import { getEventData } from "next-common/utils/sendTransaction";
import { useRouter } from "next/router";
import { useCallback } from "react";

function getThreshold(members, chain) {
  if (chain === Chains.shibuya) {
    return Math.ceil(members?.length / 2);
  } else if (chain === Chains.astar) {
    return Math.ceil((members?.length * 2) / 3);
  }
  throw new Error(`Unsupported chain: ${chain}`);
}

export default function CouncilProposeButton({ getTxFunc, loading, disabled }) {
  const router = useRouter();
  const api = useContextApi();
  const pallet = useCollectivePallet();
  const chain = useChain();

  const { members } = useCollectiveMembers();
  const threshold = getThreshold(members, chain);

  const getProposeTxFunc = useCallback(() => {
    if (!api) {
      return;
    }

    const proposal = getTxFunc();
    const proposalLength = proposal?.encodedLength || 0;

    const params =
      api.tx[pallet].propose.meta.args.length === 3
        ? [threshold, proposal, proposalLength]
        : [threshold, proposal];

    return api.tx[pallet].propose(...params);
  }, [api, getTxFunc, pallet, threshold]);

  return (
    <TxSubmissionButton
      disabled={disabled}
      loading={loading}
      getTxFunc={getProposeTxFunc}
      onInBlock={({ events }) => {
        const eventData = getEventData(events, pallet, "Proposed");
        if (!eventData) {
          return;
        }
        const [, proposalIndex] = eventData;
        router.push(`${router.pathname}/${proposalIndex}`);
      }}
    />
  );
}
