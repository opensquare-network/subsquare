import styled from "styled-components";
import GhostButton from "next-common/components/buttons/ghostButton";
import FellowshipCoreInductionPopup from "next-common/components/fellowship/core/summary/induct/popup";
import { useState } from "react";

const StyledGhostButton = styled(GhostButton)`
  height: 28px;
`;

export default function Induct() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <StyledGhostButton
        // disabled={true}
        onClick={() => setShowPopup(true)}
      >
        {/*<AddSVG />*/}
        <span className="text12Medium">Induct</span>
      </StyledGhostButton>
      {showPopup && (
        <FellowshipCoreInductionPopup onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}
