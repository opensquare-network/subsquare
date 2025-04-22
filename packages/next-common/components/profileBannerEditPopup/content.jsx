import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import { SystemUpload } from "@osn/icons/subsquare";
import { AddressUser } from "next-common/components/user";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { EditAvatar as EditBanner } from "next-common/components/setting/profile";
import { useEffect, useState } from "react";
import getIpfsLink from "next-common/utils/env/ipfsEndpoint";
import useAvatarInfo from "next-common/hooks/useAvatarInfo";
import { useAvatarPermissionsContext } from "next-common/components/profile/header/context/avatarPermissionsContext";
import { cn } from "next-common/utils";
import { useProfileBannerUrl } from "../profile/header";

export default function ProfileBannerEditPopupContent() {
  const { isProxyAccount: isProxy } = useAvatarPermissionsContext();
  const address = useProfileAddress();

  const [avatarCid] = useAvatarInfo(address);

  const [imageFile, setImageFile] = useState(null);
  const [imageDataUrl, setImageDataUrl] = useState(null);

  useEffect(() => {
    setImageFile(null);
    setImageDataUrl(null);
  }, [avatarCid]);

  const { uploading, isLoading } = {};

  const { isLoading: unsetLoading } = {};
  const save = () => {};

  const reset = () => {};

  return (
    <>
      {isProxy && (
        <GreyPanel className="text14Medium text-purple500 py-2.5 px-4 max-w-full bg-purple100 !block">
          You are editing banner for
          <AddressUser
            showAvatar={false}
            add={address}
            className="!inline-block mx-2 text-textPrimary !text14Medium"
          />
          as a proxy account.
        </GreyPanel>
      )}
      <div className="flex flex-col items-center gap-y-4">
        <h5 className="text14Bold text-textPrimary self-start">Banner</h5>
        {imageDataUrl || avatarCid ? (
          <BannerDefault
            className="w-full h-24"
            src={imageDataUrl || getIpfsLink(avatarCid)}
          />
        ) : (
          <BannerDefault className="w-full h-24" />
        )}
        <EditBanner
          setImageDataUrl={setImageDataUrl}
          setImageFile={setImageFile}
        >
          <SecondaryButton
            iconLeft={<SystemUpload className="w-4 h-4" />}
            size="small"
          >
            Upload
          </SecondaryButton>
        </EditBanner>
      </div>

      <GreyPanel className="text14Medium text-textSecondary py-2.5 px-4 max-w-full">
        Upload banner cover. We recommend to upload images in 1440x120
        resolution. Max 2 MB in JPEG or PNG format
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

function BannerDefault({ className, src }) {
  const bannerUrl = useProfileBannerUrl();
  return (
    <div
      className={cn("bg-gray-200 h-24", className)}
      style={{ backgroundImage: `url(${src ?? bannerUrl})` }}
    ></div>
  );
}
