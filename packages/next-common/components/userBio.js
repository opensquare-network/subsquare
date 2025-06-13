import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { cn } from "next-common/utils";

const BioEditPopup = dynamicPopup(() => import("./bioEditPopup"));

export default function UserBio({ bio, hasPermission }) {
  const [openBioEditPopup, setOpenBioEditPopup] = useState(false);

  return (
    <>
      <div
        className={cn(
          "text14Medium text-textTertiary",
          bio ? "text-textSecondary" : "text-textTertiary",
        )}
      >
        {bio || "Add a bio to introduce yourself. "}{" "}
        {hasPermission && (
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
