import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import { AddressUser } from "next-common/components/user";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { useAvatarPermissionsContext } from "next-common/components/profile/header/context/avatarPermissionsContext";
import LimitedTextInput from "../limitedTextInput";
import { useState } from "react";

const MAX_BIO_LENGTH = 240;

export default function BioEditPopupContent() {
  const { isProxyAccount: isProxy } = useAvatarPermissionsContext();
  const address = useProfileAddress();
  const [bio, setBio] = useState("");

  const save = () => {};

  const reset = () => {};

  return (
    <>
      {isProxy && (
        <GreyPanel className="text14Medium text-purple500 py-2.5 px-4 max-w-full bg-purple100 !block">
          You are setting avatar for
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
        value={bio}
        setValue={setBio}
      />

      <GreyPanel className="text14Medium text-textSecondary py-2.5 px-4 max-w-full">
        Write a short bio to introduce yourself. This will appear on your
        profile page. Max {MAX_BIO_LENGTH} characters.
      </GreyPanel>

      <div className="flex justify-end gap-x-2">
        <SecondaryButton onClick={reset}>Reset</SecondaryButton>
        <PrimaryButton
          onClick={save}
          disabled={!bio || bio?.length > MAX_BIO_LENGTH}
        >
          Save Change
        </PrimaryButton>
      </div>
    </>
  );
}
