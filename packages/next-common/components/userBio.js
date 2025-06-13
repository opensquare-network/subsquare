import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import useProfileAvatarPermissions from "next-common/hooks/profile/useProfileAvatarPermissions";

const BioEditPopup = dynamicPopup(() => import("./bioEditPopup"));

export default function UserBio() {
  const [openBioEditPopup, setOpenBioEditPopup] = useState(false);
  const { isSelf, isProxyAccount } = useProfileAvatarPermissions();

  return (
    <>
      <div className="text14Medium text-textTertiary">
        Add a bio to introduce yourself.{" "}
        {(isSelf || isProxyAccount) && (
          <span
            className="text-theme500 cursor-pointer"
            onClick={() => setOpenBioEditPopup(true)}
          >
            Edit
          </span>
        )}
      </div>
      {openBioEditPopup && (
        <BioEditPopup onClose={() => setOpenBioEditPopup(false)} />
      )}
    </>
  );
}
