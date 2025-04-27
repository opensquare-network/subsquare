import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import RightWrapper from "next-common/components/rightWraper";
import PrimaryButton from "next-common/lib/button/primary";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useState } from "react";
import SubIdentitiesTable from "../subTable";
import { AddressUser } from "next-common/components/user";
import useMyIdentityType from "next-common/hooks/people/useMyIdentityType";
import Loading from "next-common/components/loading";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";

const SetSubsPopup = dynamicPopup(
  () => import("next-common/components/setSubsPopup"),
  {
    ssr: false,
  },
);

export default function SubIdentitiesImpl({ isEmpty, isLoading }) {
  const [showSetSubsPopup, setShowSetSubsPopup] = useState(false);
  const { type, parent } = useMyIdentityType();
  const address = useRealAddress();
  const isSubIdentity = type === "sub";
  const parentIsSelf = parent === address;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loading size="24" />
      </div>
    );
  }

  if (isSubIdentity && !parentIsSelf) {
    return <SubIdentityParent parent={parent} />;
  }

  if (isEmpty) {
    return <SubIdentityEmpty />;
  }

  return (
    <SignerPopupWrapper>
      <SubIdentitiesTable />
      <RightWrapper className="mt-4">
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
    </SignerPopupWrapper>
  );
}

export function SubIdentityParent({ parent }) {
  if (!parent) {
    return null;
  }
  return (
    <GreyPanel className="px-4 py-2.5 text14Medium text-textSecondary mb-4">
      Currently displayed as the sub identity of{" "}
      <AddressUser className="mx-1.5" add={parent} showAvatar={false} />
      and can not create its own sub identities.
    </GreyPanel>
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
