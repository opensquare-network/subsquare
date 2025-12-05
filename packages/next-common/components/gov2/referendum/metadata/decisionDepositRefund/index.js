import { useOnchainData } from "next-common/context/post";
import { useState } from "react";
import SubLink from "next-common/components/styled/subLink";
import useSubReferendumInfo from "next-common/components/myDeposits/referenda/useSubReferendumInfo";
import { RefundWrapper } from "../styled";
import { isNil } from "lodash-es";
import BigNumber from "bignumber.js";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";
import { useReferendumVotingFinishIndexer } from "next-common/context/post/referenda/useReferendumVotingFinishHeight";

const RefundPopup = dynamicPopup(() => import("./popup"));

function DecisionDepositRefundImpl({ pallet }) {
  const { referendumIndex } = useOnchainData();
  const [showPopup, setShowPopup] = useState(false);
  const info = useSubReferendumInfo(pallet, referendumIndex);

  const { approved, rejected, timedOut, cancelled } = info || {};
  const possibleValue = approved || rejected || timedOut || cancelled;
  if (!possibleValue) {
    return null;
  }

  const [, , deposit] = approved || rejected || timedOut || cancelled;
  if (isNil(deposit)) {
    return <RefundWrapper>Refunded</RefundWrapper>;
  } else if (new BigNumber(deposit).eq(0)) {
    return null;
  }

  return (
    <RefundWrapper>
      <SubLink
        disabled={false}
        onClick={() => {
          setShowPopup(true);
        }}
      >
        Refund
      </SubLink>
      {showPopup && (
        <RefundPopup
          referendumIndex={referendumIndex}
          pallet={pallet}
          onClose={() => setShowPopup(false)}
        />
      )}
    </RefundWrapper>
  );
}

export default function DecisionDepositRefund({ pallet = "referenda" }) {
  const indexer = useReferendumVotingFinishIndexer();

  return (
    <MigrationConditionalApiProvider indexer={indexer} onlyContextApi={true}>
      <DecisionDepositRefundImpl pallet={pallet} />
    </MigrationConditionalApiProvider>
  );
}
