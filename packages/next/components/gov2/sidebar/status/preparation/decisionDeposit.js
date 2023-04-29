import styled from "styled-components";
import SubLink from "next-common/components/styled/subLink";
import { useDecisionDeposit } from "next-common/context/post/gov2/referendum";
import dynamic from "next/dynamic";
import { useState } from "react";
import { emptyFunction } from "next-common/utils";

const DepositPopup = dynamic(() => import("./depositPopup"), { ssr: false });

const Wrapper = styled.div`
  margin-top: 16px;
`;

export default function PlaceDecisionDeposit({ onDecisionDepositFinalized = emptyFunction }) {
  const deposit = useDecisionDeposit();
  const [showDepositPopup, setShowDepositPopup] = useState(false);

  return (
    <>
      <Wrapper>
        <SubLink disabled={ !!deposit }>+ Decision Deposit</SubLink>
      </Wrapper>
      {
        showDepositPopup && (
          <DepositPopup
            onClose={() => setShowDepositPopup(false)}
            onFinalized={onDecisionDepositFinalized}
          />
        )
      }
    </>
  );
}
