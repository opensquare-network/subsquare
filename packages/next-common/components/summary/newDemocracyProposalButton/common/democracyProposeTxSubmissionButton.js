import { useCallback } from "react";
import { useRouter } from "next/router";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useContextApi } from "next-common/context/api";
import { getEventData } from "next-common/utils/sendTransaction";

export function DemocracyProposeTxSubmissionButton({ getTxFunc }) {
  const router = useRouter();
  const api = useContextApi();

  const getProposeTxFunc = useCallback(() => {
    if (!api) {
      return;
    }

    const call = getTxFunc();
    if (!call) {
      return;
    }

    return api.tx.democracy.propose(
      {
        Inline: call.method.toHex(),
      },
      api?.consts?.democracy?.minimumDeposit,
    );
  }, [api, getTxFunc]);

  return (
    <TxSubmissionButton
      onInBlock={({ events }) => {
        const eventData = getEventData(events, "democracy", "Proposed");
        if (!eventData) {
          return;
        }
        const [proposalIndex] = eventData;
        router.push(`/democracy/proposals/${proposalIndex}`);
      }}
      getTxFunc={getProposeTxFunc}
    />
  );
}
