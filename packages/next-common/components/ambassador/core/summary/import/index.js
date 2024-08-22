import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { ambassadorCollectiveMembersSelector } from "next-common/store/reducers/ambassador/collective";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";
import PrimaryButton from "next-common/lib/button/primary";
import { SystemImportMember } from "@osn/icons/subsquare";
import dynamicPopup from "next-common/lib/dynamic/popup";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";
const AmbassadorCoreImportPopup = dynamicPopup(() => import("./popup"));

export default function Import() {
  const [showPopup, setShowPopup] = useState(false);
  const collectiveMembers = useSelector(ambassadorCollectiveMembersSelector);
  const { members } = useFellowshipCoreMembers();
  const realAddress = useRealAddress();

  const canImport = useMemo(() => {
    const isCollectiveMembers = (collectiveMembers || []).some((m) =>
      isSameAddress(m.address, realAddress),
    );
    const isCoreMembers = (members || []).some((m) =>
      isSameAddress(m.address, realAddress),
    );
    return isCollectiveMembers && !isCoreMembers;
  }, [collectiveMembers, members, realAddress]);

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
