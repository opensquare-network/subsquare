import { useState } from "react";
import Tooltip from "next-common/components/tooltip";
import { SystemEdit2 } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import dynamicPopup from "next-common/lib/dynamic/popup";

const AvatarEditPopup = dynamicPopup(() => import("./avatarEditPopup"));

export default function EditAvatarIconButton({
  children = null,
  isProxy = false,
}) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  return (
    <>
      <Tooltip content="Set Avatar" className="absolute bottom-0 right-0">
        <div
          className={cn(
            "flex justify-center items-center",
            "bg-neutral100 border border-neutral400 rounded-full w-[32px] h-[32px]",
            "cursor-pointer",
          )}
          onClick={() => setIsPopupOpen(true)}
        >
          <SystemEdit2 className="w-[16px] h-[16px]" />
          {children}
        </div>
      </Tooltip>
      {isPopupOpen && (
        <AvatarEditPopup
          isProxy={isProxy}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
    </>
  );
}
