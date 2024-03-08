import { useOnchainData } from "next-common/context/post";
import { useState } from "react";
import SubLink from "next-common/components/styled/subLink";
import dynamic from "next/dynamic";
import useSubReferendumInfo from "next-common/components/myDeposits/referenda/useSubReferendumInfo";
import { RefundWrapper } from "../styled";
import { isNil } from "lodash-es";
import BigNumber from "bignumber.js";

const RefundPopup = dynamic(() => import("./popup"), { ssr: false });

export default function SubmissionDepositRefund({ pallet = "referenda" }) {
  const { referendumIndex } = useOnchainData();
  const [showPopup, setShowPopup] = useState(false);
  const info = useSubReferendumInfo(pallet, referendumIndex);

  const { approved, cancelled } = info || {};
  const possibleValue = approved || cancelled;
  if (!possibleValue) {
    return null;
  }

  const [, deposit] = possibleValue;
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
