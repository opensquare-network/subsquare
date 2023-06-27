import styled from "styled-components";
import SubLink from "next-common/components/styled/subLink";
import { useDecisionDeposit } from "next-common/context/post/gov2/referendum";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const DepositPopup = dynamic(() => import("./depositPopup"), { ssr: false });

const Wrapper = styled.div`
  margin-top: 16px;
`;

export default function PlaceDecisionDeposit() {
  const deposit = useDecisionDeposit();
  const [showDepositPopup, setShowDepositPopup] = useState(false);

  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    setDisabled(!!deposit);
  }, [deposit]);

  return (
    <>
      <Wrapper>
        <SubLink
          disabled={ disabled }
          onClick={
            disabled ? () => {
            } : () => setShowDepositPopup(true)
          }
        >+ Decision Deposit</SubLink>
      </Wrapper>
      {
        showDepositPopup && (
          <DepositPopup onClose={() => setShowDepositPopup(false)} />
        )
      }
    </>
  );
}
