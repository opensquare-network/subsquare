import { useMemo, useState } from "react";
import PrimaryButton from "next-common/lib/button/primary";
import { useSelector } from "react-redux";
import { fellowshipCollectiveMembersSelector } from "next-common/store/reducers/fellowship/collective";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { fellowshipCoreMembersSelector } from "next-common/store/reducers/fellowship/core";
import { isSameAddress } from "next-common/utils";
import FellowshipCoreImportPopup from "next-common/components/fellowship/core/summary/import/popup";
import { SystemImportMember } from "@osn/icons/subsquare";

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
    // return null;
  }

  return (
    <>
      <PrimaryButton
        size="small"
        iconLeft={
          <SystemImportMember className="inline-flex w-4 h-4 [&_path]:stroke-current [&_path]:stroke-2" />
        }
        onClick={() => setShowPopup(true)}
      >
        Import me
      </PrimaryButton>
      {showPopup && (
        <FellowshipCoreImportPopup onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}
