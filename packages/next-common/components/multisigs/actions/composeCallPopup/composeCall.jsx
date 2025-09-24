import { useState } from "react";
import { useMount } from "react-use";
import {
  usePopupParams,
  useSignerContext,
} from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import ComposeCallTabs from "./composeCallTabs";
import ProposeWithInputHex from "./proposeWithInputHex";
import ProposeWithExtrinsic from "./proposeWithExtrinsic";

export default function ComposeCallPopupImpl() {
  const { multisig } = usePopupParams();
  const [formType, setFormType] = useState("set");

  const { setSelectedProxyAddress, setMultisig } = useSignerContext();

  useMount(() => {
    setSelectedProxyAddress();
    setMultisig(multisig);
  });

  return (
    <div className="flex flex-col gap-[8px]">
      <SignerWithBalance noSwitchSigner />
      <ComposeCallTabs formType={formType} setFormType={setFormType} />

      <div className={formType === "set" ? "hidden" : ""}>
        <ProposeWithInputHex />
      </div>

      <div className={formType === "input" ? "hidden" : ""}>
        <ProposeWithExtrinsic />
      </div>
    </div>
  );
}
