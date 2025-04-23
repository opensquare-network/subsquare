import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import { SystemUpload } from "@osn/icons/subsquare";
import { AddressUser } from "next-common/components/user";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { EditAvatar as EditBanner } from "next-common/components/setting/profile";
import { useEffect, useState } from "react";
import getIpfsLink from "next-common/utils/env/ipfsEndpoint";
import { useAvatarPermissionsContext } from "next-common/components/profile/header/context/avatarPermissionsContext";
import { cn } from "next-common/utils";
import { useProfileBannerUrl } from "../profile/header";
import useBannerSubmission from "next-common/hooks/profile/banner/useBannerSubmission";
import useBannerReset from "next-common/hooks/profile/banner/useBannerReset";
import { noop } from "lodash-es";
import { useProfileUserInfoContext } from "next-common/components/profile/header/context/profileUserInfoContext";

export default function ProfileBannerEditPopupContent({ closePopup = noop }) {
  const { isProxyAccount: isProxy } = useAvatarPermissionsContext();
  const address = useProfileAddress();
  const proxyAddress = isProxy ? address : null;
  const { fetch, user } = useProfileUserInfoContext();

  const [bannerCid, setBannerCid] = useState(user?.bannerCid);

  const [imageFile, setImageFile] = useState(null);
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const { reset: resetBanner, isResetting: unsetLoading } =
    useBannerReset(proxyAddress);
  const { setBanner, isLoading, uploading } = useBannerSubmission(
    imageFile,
    proxyAddress,
  );

  useEffect(() => {
    setImageFile(null);
    setImageDataUrl(null);
  }, [bannerCid]);

  const save = async () => {
    try {
      await setBanner();
      fetch();
      closePopup();
    } catch (error) {
      /** empty */
    }
  };

  const reset = async () => {
    try {
      await resetBanner();
      setBannerCid(null);
      fetch();
      closePopup();
    } catch (error) {
      /** empty */
    }
  };

  return (
    <>
      {isProxy && (
        <GreyPanel className="text14Medium text-purple500 py-2.5 px-4 max-w-full bg-purple100 !block">
          You are setting banner for
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
        {imageDataUrl || bannerCid ? (
          <BannerContent src={imageDataUrl || getIpfsLink(bannerCid)} />
        ) : (
          <BannerContent />
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
          disabled={unsetLoading || !bannerCid}
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

function BannerContent({ className, src }) {
  const bannerUrl = useProfileBannerUrl();
  return (
    <div
      className={cn(
        "bg-gray-200 h-24 w-full bg-cover bg-no-repeat bg-center",
        className,
      )}
      style={{ backgroundImage: `url(${src ?? bannerUrl})` }}
    ></div>
  );
}
