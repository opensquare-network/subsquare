import SignerPopup from "next-common/components/signerPopup";
import React from "react";
import { emptyFunction } from "next-common/utils";
import useAddressInput from "next-common/components/fellowship/core/summary/induct/useAddressInput";

function Content() {
  const { address, component } = useAddressInput("Who");
  console.log("address", address);

  return component;
}

export default function FellowshipCoreInductionPopup({
  onClose = emptyFunction,
}) {
  return (
    <SignerPopup
      title="Induct"
      onClose={onClose}
      actionCallback={(api, account) =>
        console.log("api", api, "account", account)
      }
    >
      <Content />
    </SignerPopup>
  );
}
