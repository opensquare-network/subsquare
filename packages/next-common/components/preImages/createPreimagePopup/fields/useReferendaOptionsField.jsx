import ReferendaOptionsField from "next-common/components/popup/fields/referendaOptionsField";
import { useState } from "react";

export function useReferendaOptionsField(decisionDepositValue) {
  const [checkDecisionDeposit, setCheckDecisionDeposit] = useState(true);
  const [checkVoteAye, setCheckVoteAye] = useState(true);

  return {
    value: {
      checkDecisionDeposit,
      checkVoteAye,
    },
    component: (
      <ReferendaOptionsField
        decisionDepositValue={decisionDepositValue}
        checkDecisionDeposit={checkDecisionDeposit}
        onCheckDecisionDeposit={() => {
          setCheckDecisionDeposit(!checkDecisionDeposit);
        }}
        checkVoteAye={checkVoteAye}
        onCheckVoteAye={() => {
          setCheckVoteAye(!checkVoteAye);
        }}
      />
    ),
  };
}
