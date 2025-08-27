import RightWrapper from "next-common/components/rightWraper";
import PrimaryButton from "next-common/lib/button/primary";
import { Account } from "next-common/components/overview/accountInfo/accountInfoPanel";
import Loading from "next-common/components/loading";
import Divider from "next-common/components/styled/layout/divider";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { useState } from "react";
import useMyIdentityType from "next-common/hooks/people/useMyIdentityType";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import IdentityPropList, {
  SubIdentityDisplay,
  SubIdentityInfoPanel,
} from "next-common/components/people/overview/identity/common";
import { DirectIdentityActions } from "next-common/components/people/overview/identity/directIdentityActions";

const SetIdentityPopup = dynamicPopup(
  () => import("next-common/components/setIdentityPopup"),
  {
    ssr: false,
  },
);

export default function DirectIdentityImpl({
  isEmpty,
  identityInfo,
  isLoading,
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loading size="24" />
      </div>
    );
  }

  if (!isEmpty) {
    return (
      <SignerPopupWrapper>
        <DirectIdentity subMyIdentityInfo={identityInfo} />
      </SignerPopupWrapper>
    );
  }
  return <DirectIdentityEmpty />;
}

export function DirectIdentityEmpty() {
  const [showSetIdentityPopup, setShowSetIdentityPopup] = useState(false);
  return (
    <div className="space-y-4">
      <GreyPanel className="px-4 py-2.5 text14Medium text-textSecondary">
        No identity is set for the connected account.
      </GreyPanel>
      <RightWrapper>
        <PrimaryButton
          className="w-auto"
          onClick={() => setShowSetIdentityPopup(true)}
        >
          Set Identity
        </PrimaryButton>
      </RightWrapper>

      {showSetIdentityPopup && (
        <SetIdentityPopup onClose={() => setShowSetIdentityPopup(false)} />
      )}
    </div>
  );
}

export function DirectIdentity({ subMyIdentityInfo }) {
  const { type, parent } = useMyIdentityType();
  const isSubIdentity = type === "sub";

  return (
    <>
      <SubIdentityInfoPanel
        isSubIdentity={isSubIdentity}
        parentAddress={parent}
      />
      <div className="flex justify-between gap-2">
        <Account />
        <DirectIdentityActions />
      </div>

      <Divider className="my-4" />
      <IdentityPropList identityInfo={subMyIdentityInfo} />
      <SubIdentityDisplay
        isSubIdentity={isSubIdentity}
        parentAddress={parent}
      />
    </>
  );
}
