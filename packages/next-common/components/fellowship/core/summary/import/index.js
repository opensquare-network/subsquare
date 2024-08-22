import { useMemo, useState } from "react";
import PrimaryButton from "next-common/lib/button/primary";
import { useSelector } from "react-redux";
import { fellowshipCollectiveMembersSelector } from "next-common/store/reducers/fellowship/collective";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";
import { SystemImportMember } from "@osn/icons/subsquare";
import dynamicPopup from "next-common/lib/dynamic/popup";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";

const FellowshipCoreImportPopup = dynamicPopup(() =>
  import("next-common/components/fellowship/core/summary/import/popup"),
);

export default function Import() {
  const [showPopup, setShowPopup] = useState(false);
  const collectiveMembers = useSelector(fellowshipCollectiveMembersSelector);
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
        <FellowshipCoreImportPopup onClose={() => setShowPopup(false)} />
      )}
    </>
  );
}
