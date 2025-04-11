import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import { SystemUpload, SystemAvatarDefault } from "@osn/icons/subsquare";
import { AddressUser } from "next-common/components/user";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { EditAvatar } from "next-common/components/setting/profile";
import { useEffect, useState } from "react";
import { useAvatarSubmission } from "next-common/components/setting/publishAvatarPopup";
import getIpfsLink from "next-common/utils/env/ipfsEndpoint";
import { AvatarImg } from "next-common/components/user/styled";
import useAvatarInfo from "next-common/hooks/useAvatarInfo";
import { useAvatarUnset } from "next-common/components/setting/unsetAvatarPopup";

export default function AvatarEditPopupContent({ isProxy = false }) {
  const address = useProfileAddress();
  const proxyAddress = isProxy ? address : null;

  const [avatarCid] = useAvatarInfo(address);

  const [imageFile, setImageFile] = useState(null);
  const [imageDataUrl, setImageDataUrl] = useState(null);

  useEffect(() => {
    setImageFile(null);
    setImageDataUrl(null);
  }, [avatarCid]);

  const { uploading, isLoading, submitAvatar } = useAvatarSubmission(
    imageFile,
    proxyAddress,
  );

  const { isLoading: unsetLoading, unsetAvatar } = useAvatarUnset(proxyAddress);

  const save = () => {
    submitAvatar();
  };

  const reset = () => {
    unsetAvatar();
  };

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
      <div className="flex flex-col items-center gap-y-4">
        <h5 className="text14Bold text-textPrimary self-start">Avatar</h5>
        {imageDataUrl || avatarCid ? (
          <AvatarImg
            className="w-24 h-24"
            src={imageDataUrl || getIpfsLink(avatarCid)}
            size={96}
          />
        ) : (
          <SystemAvatarDefault size={96} className="w-24 h-24" />
        )}
        <EditAvatar
          setImageDataUrl={setImageDataUrl}
          setImageFile={setImageFile}
        >
          <SecondaryButton
            iconLeft={<SystemUpload className="w-4 h-4" />}
            size="small"
          >
            Upload
          </SecondaryButton>
        </EditAvatar>
      </div>

      <GreyPanel className="text14Medium text-textSecondary py-2.5 px-4 max-w-full">
        Upload new avatar and save. We recommend to upload images in 256x256
        resolution. Max 2 MB in JPEG, PNG or GIF format.
      </GreyPanel>

      <div className="flex justify-end gap-x-2">
        <SecondaryButton
          onClick={reset}
          disabled={unsetLoading || !avatarCid}
          loading={unsetLoading}
        >
          Reset
        </SecondaryButton>
        <PrimaryButton
          onClick={save}
          disabled={uploading || isLoading || !imageFile}
          loading={uploading || isLoading}
        >
          Save Change
        </PrimaryButton>
      </div>
    </>
  );
}
