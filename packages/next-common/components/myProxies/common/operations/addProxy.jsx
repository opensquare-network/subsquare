import { useState } from "react";
import PrimaryButton from "next-common/lib/button/primary";
import { SystemAddProxy } from "@osn/icons/subsquare";
import { ChoiceButton } from "next-common/components/summary/newProposalButton/common";
import Popup from "next-common/components/popup/wrapper/Popup";
import PopupWithSigner from "next-common/components/popupWithSigner";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";

function AddProxyForm({ props }) {
  return (
    <PopupWithSigner title="Add Proxy" {...props} wide>
      <div className="space-y-4">
        <SignerWithBalance title="Account" />
        {/* Add form content for proxy account here */}
        {/* Including:
          1. Proxy account address input
          2. Proxy type selection
          3. Delay block number setting (if needed)
          4. Advanced settings (if needed)
        */}
      </div>
    </PopupWithSigner>
  );
}

function ProxyTypeSelector({ onSelect, onClose }) {
  return (
    <Popup wide className="!w-[640px]" title="Set Proxy" onClose={onClose}>
      <div className="flex flex-col !mt-[24px] gap-[16px]">
        <ChoiceButton
          icon={<SystemAddProxy className="text-textTertiary w-10 h-10" />}
          name="Add a Proxy Account"
          onClick={onSelect}
        />
      </div>
    </Popup>
  );
}

export default function AddProxy() {
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <>
      <PrimaryButton size="small" onClick={() => setShowTypeSelector(true)}>
        Set Proxy
      </PrimaryButton>

      {showTypeSelector && (
        <ProxyTypeSelector
          onSelect={() => {
            setShowAddForm(true);
            setShowTypeSelector(false);
          }}
          onClose={() => setShowTypeSelector(false)}
        />
      )}

      {showAddForm && <AddProxyForm onClose={() => setShowAddForm(false)} />}
    </>
  );
}
