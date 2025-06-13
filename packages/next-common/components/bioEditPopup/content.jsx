import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import { AddressUser } from "next-common/components/user";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { useAvatarPermissionsContext } from "next-common/components/profile/header/context/avatarPermissionsContext";
import LimitedTextInput from "../limitedTextInput";
import { useState } from "react";
import useBioSubmission from "next-common/hooks/profile/bio/useBioSubmission";
import useBioReset from "next-common/hooks/profile/bio/useBioReset";
import { useProfileUserInfoContext } from "../profile/header/context/profileUserInfoContext";

const MAX_BIO_LENGTH = 240;

export default function BioEditPopupContent() {
  const { isProxyAccount: isProxy } = useAvatarPermissionsContext();
  const { fetch, user } = useProfileUserInfoContext();
  const address = useProfileAddress();
  const [bioValue, setBioValue] = useState(user?.bio || "");

  const { setBio, isLoading: isSetting } = useBioSubmission(
    bioValue,
    isProxy ? address : null,
  );
  const { resetBio, isLoading: isResetting } = useBioReset(
    isProxy ? address : null,
  );

  const save = () => {
    setBio().then(() => {
      fetch();
    });
  };

  const reset = () => {
    resetBio().then(() => {
      fetch();
    });
  };

  return (
    <>
      {isProxy && (
        <GreyPanel className="text14Medium text-purple500 py-2.5 px-4 max-w-full bg-purple100 !block">
          You are editing bio for
          <AddressUser
            showAvatar={false}
            add={address}
            className="!inline-block mx-2 text-textPrimary !text14Medium"
          />
          as a proxy account.
        </GreyPanel>
      )}
      <LimitedTextInput
        textAreaClassName="w-full h-[120px]"
        title="Short Bio"
        maxLength={MAX_BIO_LENGTH}
        placeholder={`Write a short bio to introduce yourself. This will appear on your profile page. Max ${MAX_BIO_LENGTH} characters.`}
        value={bioValue}
        setValue={setBioValue}
      />

      <GreyPanel className="text14Medium text-textSecondary py-2.5 px-4 max-w-full">
        Write a short bio to introduce yourself. This will appear on your
        profile page. Max {MAX_BIO_LENGTH} characters.
      </GreyPanel>

      <div className="flex justify-end gap-x-2">
        <SecondaryButton onClick={reset} disabled={isResetting}>
          Reset
        </SecondaryButton>
        <PrimaryButton
          onClick={save}
          disabled={!bioValue || bioValue?.length > MAX_BIO_LENGTH}
          loading={isSetting || isResetting}
        >
          Save Change
        </PrimaryButton>
      </div>
    </>
  );
}
