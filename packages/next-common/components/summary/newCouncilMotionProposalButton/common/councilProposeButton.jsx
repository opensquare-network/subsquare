import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useContextApi } from "next-common/context/api";
import { useChain } from "next-common/context/chain";
import { useCollectivePallet } from "next-common/context/collective";
import Chains from "next-common/utils/consts/chains";
import useCollectiveMembers from "next-common/utils/hooks/collectives/useCollectiveMembers";
import { getEventData } from "next-common/utils/sendTransaction";
import { useRouter } from "next/router";
import { useCallback } from "react";

function useDefaultThreshold() {
  const chain = useChain();
  const { members } = useCollectiveMembers();

  if (chain === Chains.astar) {
    return Math.ceil((members?.length * 2) / 3);
  }

  return Math.ceil(members?.length / 2);
}

export default function CouncilProposeButton({
  threshold,
  getTxFunc,
  loading,
  disabled,
}) {
  const router = useRouter();
  const api = useContextApi();
  const pallet = useCollectivePallet();
  const defaultThreshold = useDefaultThreshold();
  const proposalThreshold = threshold ?? defaultThreshold;

  const getProposeTxFunc = useCallback(() => {
    if (!api) {
      return;
    }

    const proposal = getTxFunc();
    if (!proposal) {
      return;
    }
    const proposalLength = proposal?.encodedLength || 0;

    const params =
      api.tx[pallet].propose.meta.args.length === 3
        ? [proposalThreshold, proposal, proposalLength]
        : [proposalThreshold, proposal];

    return api.tx[pallet].propose(...params);
  }, [api, getTxFunc, pallet, proposalThreshold]);

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
