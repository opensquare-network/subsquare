import { noop } from "lodash-es";
import Popup from "next-common/components/popup/wrapper/Popup";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import { SystemUpload, SystemAvatarDefault } from "@osn/icons/subsquare";
import { AddressUser } from "next-common/components/user";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { EditAvatar } from "next-common/components/setting/profile";

export default function AvatarEditPopup({
  onClose = noop,
  isProxy = false,
  title = "Set Avatar",
}) {
  const profileAddress = useProfileAddress();

  return (
    <Popup title={title} onClose={onClose}>
      {isProxy && (
        <GreyPanel className="text14Medium text-purple500 py-2.5 px-4 max-w-full bg-purple100 gap-x-2">
          You are setting avatar for
          <AddressUser showAvatar={false} add={profileAddress} />
          as a proxy account.
        </GreyPanel>
      )}
      <div className="flex flex-col items-center gap-y-4">
        <h5 className="text14Bold text-textPrimary self-start">Avatar</h5>
        <SystemAvatarDefault size={96} className="w-24 h-24" />
        <EditAvatar setImageDataUrl={noop} setImageFile={noop}>
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
        <SecondaryButton>Reset</SecondaryButton>
        <PrimaryButton>Save Change</PrimaryButton>
      </div>
    </Popup>
  );
}
