import { useOnchainData } from "next-common/context/post";
import { useState } from "react";
import SubLink from "next-common/components/styled/subLink";
import useSubReferendumInfo from "next-common/components/myDeposits/referenda/useSubReferendumInfo";
import { RefundWrapper } from "../styled";
import { isNil } from "lodash-es";
import BigNumber from "bignumber.js";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useContextApi } from "next-common/context/api";

const SlashPopup = dynamicPopup(() => import("./popup"));

export default function SubmissionDepositSlash({ pallet = "referenda" }) {
  const { referendumIndex } = useOnchainData();
  const [showPopup, setShowPopup] = useState(false);
  const info = useSubReferendumInfo(pallet, referendumIndex);
  const api = useContextApi();

  const { rejected, timedOut, killed } = info || {};
  if (killed) {
    return <RefundWrapper>Slashed</RefundWrapper>;
  }

  const possibleValue = rejected || timedOut;
  if (!possibleValue) {
    return null;
  }

  const [, deposit] = possibleValue;
  if (isNil(deposit)) {
    return <RefundWrapper>Slashed</RefundWrapper>;
  }

  if (!api?.tx?.[pallet]?.slashSubmissionDeposit) {
    return null;
  }

  if (new BigNumber(deposit?.amount).eq(0)) {
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
        Slash
      </SubLink>
      {showPopup && (
        <SlashPopup
          referendumIndex={referendumIndex}
          pallet={pallet}
          onClose={() => setShowPopup(false)}
        />
      )}
    </RefundWrapper>
  );
}
