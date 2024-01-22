import { Button } from "next-common/components/summary/styled";
import AddSVG from "next-common/assets/imgs/icons/add.svg";
import SubmitProposalPopup from "./submitProposalPopup";
import { useState } from "react";
import styled from "styled-components";

const AddButton = styled(Button)`
  display: flex;
  background-color: var(--theme500);
  color: var(--textPrimaryContrast);
  border: none;
  > svg path {
    stroke: var(--textPrimaryContrast);
  }
`;

export default function NewProposalButton({ pallet }) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <AddButton onClick={() => setShowPopup(true)}>
        <AddSVG />
        New Proposal
      </AddButton>
      {showPopup && (
        <SubmitProposalPopup
          pallet={pallet}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}
