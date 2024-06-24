import SecondaryButton from "next-common/lib/button/secondary";
import { SystemSubtract } from "@osn/icons/subsquare";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";

const RevokePopup = dynamicPopup(() => import("./revokePopup"));

export function RevokeButton({ address }) {
  const [showRevotePopup, setShowRevotePopup] = useState(false);

  return (
    <>
      <SecondaryButton
        size="small"
        iconLeft={<SystemSubtract className="w-4 h-4" />}
        onClick={() => setShowRevotePopup(true)}
      >
        Revoke
      </SecondaryButton>
      {showRevotePopup && (
        <RevokePopup
          address={address}
          onClose={() => setShowRevotePopup(false)}
        />
      )}
    </>
  );
}

export default function DetailButtons({ address }) {
  const realAddress = useRealAddress();
  const isMyDelegate = address === realAddress;

  return (
    isMyDelegate && (
      <div className="flex gap-[8px]">
        <RevokeButton address={address} />
      </div>
    )
  );
}
