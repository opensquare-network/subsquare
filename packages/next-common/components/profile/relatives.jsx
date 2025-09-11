import Button from "next-common/lib/button";
import dynamic from "next/dynamic";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import useProfileAddress from "./useProfileAddress";
import RelativesWithNullGuard from "next-common/components/relationshipPopup/relativesWithNullGuard";

const ArrowRight = dynamic(
  import("@osn/icons/subsquare").then((mod) => mod.ArrowRight),
);
const SystemRelatives = dynamic(
  import("@osn/icons/subsquare").then((mod) => mod.SystemRelatives),
);
const RelativesPopup = dynamicPopup(() => import("../relationshipPopup"));

export default function Relatives() {
  const address = useProfileAddress();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <RelativesWithNullGuard>
      <Button
        size="small"
        className="border-neutral400 text-textPrimary bg-neutral100"
        iconRight={<ArrowRight className="w-4 h-4 text-textTertiary" />}
        iconLeft={<SystemRelatives className="w-4 h-4 text-textTertiary" />}
        onClick={() => setIsPopupOpen(true)}
      >
        Relatives
      </Button>
      {isPopupOpen && (
        <RelativesPopup
          onClose={() => setIsPopupOpen(false)}
          sourceAddress={address}
        />
      )}
    </RelativesWithNullGuard>
  );
}
