import { useState } from "react";
import Tooltip from "next-common/components/tooltip";
import { SystemEdit2, SystemClose } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import dynamicPopup from "next-common/lib/dynamic/popup";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useProfileAddress from "next-common/components/profile/useProfileAddress";

const RenameSubPopup = dynamicPopup(() => import("./renameSubPopup"), {
  ssr: false,
});

const RemoveSubPopup = dynamicPopup(() => import("./removeSubPopup"), {
  ssr: false,
});

export default function SubIdentityActions({
  address,
  currentName,
  onSuccess,
}) {
  const [showRenamePopup, setShowRenamePopup] = useState(false);
  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const realAddress = useRealAddress();
  const profileAddress = useProfileAddress();
  if (realAddress !== profileAddress) {
    return null;
  }

  return (
    <>
      <div className="flex justify-end items-center space-x-2">
        <Tooltip content="Rename">
          <div
            className={cn(
              "flex justify-center items-center",
              "bg-neutral100 border border-neutral400 rounded-md w-[28px] h-[28px]",
              "cursor-pointer",
            )}
            onClick={() => setShowRenamePopup(true)}
          >
            <SystemEdit2 className="w-[16px] h-[16px] text-textPrimary" />
          </div>
        </Tooltip>
        <Tooltip content="Remove">
          <div
            className={cn(
              "flex justify-center items-center",
              "bg-neutral100 border border-neutral400 rounded-md w-[28px] h-[28px]",
              "cursor-pointer",
            )}
            onClick={() => setShowRemovePopup(true)}
          >
            <SystemClose className="w-[16px] h-[16px] text-textPrimary" />
          </div>
        </Tooltip>
      </div>
      {showRenamePopup && (
        <RenameSubPopup
          address={address}
          currentName={currentName}
          onClose={() => setShowRenamePopup(false)}
          onSuccess={onSuccess}
        />
      )}
      {showRemovePopup && (
        <RemoveSubPopup
          address={address}
          currentName={currentName}
          onClose={() => setShowRemovePopup(false)}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
}
