import { useOnchainData } from "next-common/context/post";
import { useState } from "react";
import SubLink from "next-common/components/styled/subLink";
import dynamic from "next/dynamic";
import useSubReferendumInfo from "next-common/components/myDeposits/referenda/useSubReferendumInfo";
import { RefundWrapper } from "../styled";
import { isNil } from "lodash-es";
import BigNumber from "bignumber.js";

const RefundPopup = dynamic(() => import("./popup"), { ssr: false });

export default function DecisionDepositRefund({ pallet = "referenda" }) {
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
