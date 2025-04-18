import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import RightWrapper from "next-common/components/rightWraper";
import PrimaryButton from "next-common/lib/button/primary";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useState } from "react";
import SubIdentitiesTable from "../subTable";

const SetSubsPopup = dynamicPopup(
  () => import("next-common/components/setSubsPopup"),
  {
    ssr: false,
  },
);

export default function SubIdentitiesImpl() {
  const [showSetSubsPopup, setShowSetSubsPopup] = useState(false);
  return (
    <>
      <SubIdentitiesTable />
      <RightWrapper>
        <PrimaryButton
          className="w-auto"
          onClick={() => setShowSetSubsPopup(true)}
        >
          Set Subs
        </PrimaryButton>
      </RightWrapper>
      {showSetSubsPopup && (
        <SetSubsPopup onClose={() => setShowSetSubsPopup(false)} />
      )}
    </>
  );
}

export function SubIdentityEmpty() {
  return (
    <div className="space-y-4">
      <GreyPanel className="px-4 py-2.5 text14Medium text-textSecondary">
        Please set direct identity first.
      </GreyPanel>
    </div>
  );
}
