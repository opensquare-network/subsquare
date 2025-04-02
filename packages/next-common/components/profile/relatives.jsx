import Button from "next-common/lib/button";
import dynamic from "next/dynamic";
import { useState } from "react";

const ArrowRight = dynamic(
  import("@osn/icons/subsquare").then((mod) => mod.ArrowRight),
);
const SystemRelatives = dynamic(
  import("@osn/icons/subsquare").then((mod) => mod.SystemRelatives),
);
const RelativesPopup = dynamic(() => import("../relationshipPopup"));

export default function Relatives() {
  const [popupVisibled, setPopupVisbled] = useState(false);
  return (
    <>
      <Button
        size="small"
        className="border-neutral400 text-textPrimary mt-4"
        iconRight={<ArrowRight className="w-4 h-4 text-textTertiary" />}
        iconLeft={<SystemRelatives className="w-4 h-4 text-textTertiary" />}
        onClick={() => setPopupVisbled(true)}
      >
        Relatives
      </Button>
      {popupVisibled && (
        <RelativesPopup onClose={() => setPopupVisbled(false)} />
      )}
    </>
  );
}
