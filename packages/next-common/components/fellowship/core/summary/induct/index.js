import styled from "styled-components";
import GhostButton from "next-common/components/buttons/ghostButton";
import FellowshipCoreInductionPopup from "next-common/components/fellowship/core/summary/induct/popup";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { fellowshipCollectiveMembersSelector } from "next-common/store/reducers/fellowship/collective";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";

const StyledGhostButton = styled(GhostButton)`
  height: 28px;
`;

export default function Induct() {
  const [showPopup, setShowPopup] = useState(false);
  const members = useSelector(fellowshipCollectiveMembersSelector);
  const realAddress = useRealAddress();

  const canInduct = useMemo(() => {
    const found = (members || []).find((m) =>
      isSameAddress(m.address, realAddress),
    );
    return found && found.rank >= 3;
  }, [members, realAddress]);

  return (
    <>
      <StyledGhostButton
        disabled={!canInduct}
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
