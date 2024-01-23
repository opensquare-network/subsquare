import { Button } from "next-common/components/summary/styled";
import AddSVG from "next-common/assets/imgs/icons/add.svg";
import styled from "styled-components";

const AddButton = styled(Button)`
  display: flex;
  height: 30px;
  background-color: var(--theme500);
  color: var(--textPrimaryContrast);
  border: none;
  > svg path {
    stroke: var(--textPrimaryContrast);
  }
`;

export default function NewButton({ setShowPopup }) {
  return (
    <AddButton onClick={() => setShowPopup(true)}>
      <AddSVG />
      New Proposal
    </AddButton>
  );
}
