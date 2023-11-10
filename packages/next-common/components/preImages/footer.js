import { Button } from "next-common/components/summary/styled";
import styled from "styled-components";
import AddSVG from "next-common/assets/imgs/icons/add.svg";
import { useState } from "react";
import NewPreimagePopup from "./newPreimagePopup";

const AddButton = styled(Button)`
  display: flex;
  padding: 7px;
  background-color: var(--theme500);
  color: var(--textPrimaryContrast);
  border: none;
  > svg path {
    stroke: var(--textPrimaryContrast);
  }
`;

export default function PreImagesFooter() {
  const [showNewPreimagePopup, setShowNewPreimagePopup] = useState(false);

  return (
    <div className="flex justify-end">
      <AddButton onClick={() => setShowNewPreimagePopup(true)}>
        <AddSVG />
        New Preimage
      </AddButton>
      {showNewPreimagePopup && (
        <NewPreimagePopup onClose={() => setShowNewPreimagePopup(false)} />
      )}
    </div>
  );
}
