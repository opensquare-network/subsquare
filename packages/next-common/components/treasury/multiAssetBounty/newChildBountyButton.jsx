import React, { useState } from "react";
import { useOnchainData } from "next-common/context/post";
import NewChildBountyPopup from "./newChildBountyPopup";
import PrimaryButton from "next-common/lib/button/primary";
export default function NewChildBountyButton() {
  const { bountyIndex } = useOnchainData();
  const [open, setOpen] = useState(false);
  if (bountyIndex == null) return null;
  return (
    <>
      {
        <PrimaryButton className="w-full" onClick={() => setOpen(true)}>
          New Child Bounty
        </PrimaryButton>
      }
      {open && <NewChildBountyPopup onClose={() => setOpen(false)} />}
    </>
  );
}
