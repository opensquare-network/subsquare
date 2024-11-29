import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useContextApi } from "next-common/context/api";
import { useCollectivePallet } from "next-common/context/collective";
import useCollectiveMembers from "next-common/utils/hooks/collectives/useCollectiveMembers";
import { getEventData } from "next-common/utils/sendTransaction";
import { useRouter } from "next/router";
import { useCallback } from "react";

export default function CouncilProposeButton({ getTxFunc, loading, disabled }) {
  const router = useRouter();
  const api = useContextApi();
  const pallet = useCollectivePallet();

  const { members } = useCollectiveMembers();
  const threshold = Math.floor(members?.length / 2) + 1;

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
