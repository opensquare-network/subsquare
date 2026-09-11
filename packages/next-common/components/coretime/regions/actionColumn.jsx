import { useState } from "react";
import { SystemMenu } from "@osn/icons/subsquare";
import SecondaryButton from "next-common/lib/button/secondary";
import dynamicPopup from "next-common/lib/dynamic/popup";
import Tooltip from "next-common/components/tooltip";

const RegionDetailPopup = dynamicPopup(() => import("./detailPopup"));

export default function RegionActionColumn({ region }) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <Tooltip content="View region details">
        <SecondaryButton
          aria-label="View region details"
          className="w-7 h-7 p-0"
          onClick={() => setShowPopup(true)}
        >
          <SystemMenu className="w-4 h-4" />
        </SecondaryButton>
      </Tooltip>
      {showPopup && (
        <RegionDetailPopup
          region={region}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}
