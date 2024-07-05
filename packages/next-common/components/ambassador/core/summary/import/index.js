import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { ambassadorCollectiveMembersSelector } from "next-common/store/reducers/ambassador/collective";
import { ambassadorCoreMembersSelector } from "next-common/store/reducers/ambassador/core";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";
import PrimaryButton from "next-common/lib/button/primary";
import { SystemImportMember } from "@osn/icons/subsquare";
import dynamicPopup from "next-common/lib/dynamic/popup";
const AmbassadorCoreImportPopup = dynamicPopup(() => import("./popup"));

export default function Import() {
  const [showPopup, setShowPopup] = useState(false);
  const collectiveMembers = useSelector(ambassadorCollectiveMembersSelector);
  const coreMembers = useSelector(ambassadorCoreMembersSelector);
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
        <AmbassadorCoreImportPopup onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}
