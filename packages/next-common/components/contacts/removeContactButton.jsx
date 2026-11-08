import { useState } from "react";
import { SystemClose } from "@osn/icons/subsquare";
import Tooltip from "next-common/components/tooltip";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { cn } from "next-common/utils";

const RemoveContactPopup = dynamicPopup(() => import("./removeContactPopup"));

export default function RemoveContactButton({ contact }) {
  const [popupOpen, setPopupOpen] = useState(false);

  return (
    <>
      <Tooltip content="Remove">
        <button
          type="button"
          className={cn(
            "flex items-center justify-center",
            "p-1.5 rounded cursor-pointer",
            "border border-neutral400",
            "text-textPrimary hover:bg-neutral200",
          )}
          onClick={() => setPopupOpen(true)}
        >
          <SystemClose width={16} height={16} />
        </button>
      </Tooltip>
      {popupOpen && (
        <RemoveContactPopup
          contact={contact}
          onClose={() => setPopupOpen(false)}
        />
      )}
    </>
  );
}
