import { useOnchainData } from "next-common/context/post";
import { useState } from "react";
import styled from "styled-components";
import SubLink from "next-common/components/styled/subLink";
import dynamic from "next/dynamic";
import useSubReferendumInfo from "next-common/components/myDeposits/referenda/useSubReferendumInfo";

const RefundPopup = dynamic(() => import("./popup"), { ssr: false });

const Wrapper = styled.div`
  font-weight: 500;
  color: var(--textTertiary);
  &::before {
    content: "·";
    color: var(--textTertiary);
    padding-right: 8px;
  }

  a {
    color: var(--theme500);
  }
`;

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
  if (!deposit) {
    return <Wrapper>Refunded</Wrapper>;
  }

  return (
    <Wrapper>
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
    </Wrapper>
  );
}
