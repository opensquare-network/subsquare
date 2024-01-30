import { useMemo, useState } from "react";
import PrimaryButton from "next-common/components/buttons/primaryButton";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { fellowshipCollectiveMembersSelector } from "next-common/store/reducers/fellowship/collective";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { fellowshipCoreMembersSelector } from "next-common/store/reducers/fellowship/core";
import { isSameAddress } from "next-common/utils";
import FellowshipCoreImportPopup from "next-common/components/fellowship/core/summary/import/popup";

const StyledPrimaryButton = styled(PrimaryButton)`
  height: 28px;
`;

export default function Import() {
  const [showPopup, setShowPopup] = useState(false);
  const collectiveMembers = useSelector(fellowshipCollectiveMembersSelector);
  const coreMembers = useSelector(fellowshipCoreMembersSelector);
  const realAddress = useRealAddress();

  const canImport = useMemo(() => {
    const isCollectiveMembers = (collectiveMembers || []).some((m) =>
      isSameAddress(m.address, realAddress),
    );
    const isCoreMembers = (coreMembers || []).some((m) =>
      isSameAddress(m.address, realAddress),
    );
    return isCollectiveMembers && !isCoreMembers;
  }, [collectiveMembers, coreMembers, realAddress]);

  if (!canImport) {
    return null;
  }

  return (
    <>
      <StyledPrimaryButton onClick={() => setShowPopup(true)}>
        <span className="text12Medium">Import me</span>
      </StyledPrimaryButton>
      {showPopup && (
        <FellowshipCoreImportPopup onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}
