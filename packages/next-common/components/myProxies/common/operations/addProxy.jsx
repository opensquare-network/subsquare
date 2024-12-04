import { useState, useCallback } from "react";
import PrimaryButton from "next-common/lib/button/primary";
import { SystemAddProxy } from "@osn/icons/subsquare";
import { ChoiceButton } from "next-common/components/summary/newProposalButton/common";
import Popup from "next-common/components/popup/wrapper/Popup";
import PopupWithSigner from "next-common/components/popupWithSigner";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import Select from "next-common/components/select";

function ProxyTypeSelector({ proxyType, setProxyType }) {
  const options = [
    {
      value: "Any",
      label: "Any",
    },
    {
      value: "NonTransfer",
      label: "NonTransfer",
    },
    {
      value: "Governance",
      label: "Governance",
    },
    {
      value: "Staking",
      label: "Staking",
    },
  ];
  return (
    <>
      <span className="text-textPrimary my-[12px] w-[144px]">Type</span>
      <Select
        small
        className="w-full h-[40px] text12Medium"
        value={proxyType}
        options={options}
        onChange={({ value }) => {
          setProxyType(value);
        }}
      />
    </>
  );
}

// TODO: 1. proxy type optioins
// TODO: 2. delay options
// TODO: 3. advance settings
function PopupContent({ onClose }) {
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const { value: proxyAccount, component: proxyAccountField } =
    useAddressComboField({ title: "Proxy Account" });
  const [proxyType, setProxyType] = useState("Any");
  // const [delay, setDelay] = useState(0);
  const delay = 0;

  const getTxFunc = useCallback(() => {
    if (!api || !signerAccount?.realAddress || !proxyAccount) {
      return;
    }

    return api.tx.proxy.addProxy(proxyAccount, proxyType, delay);
  }, [api, signerAccount, proxyAccount, proxyType, delay]);

  return (
    <div className="space-y-4">
      <SignerWithBalance title="Account" />
      {proxyAccountField}
      <ProxyTypeSelector proxyType={proxyType} setProxyType={setProxyType} />
      <AdvanceSettings></AdvanceSettings>
      <TxSubmissionButton getTxFunc={getTxFunc} onClose={onClose} />
    </div>
  );
}

function AddProxyPopup({ onClose }) {
  return (
    <PopupWithSigner title="Add Proxy" onClose={onClose} wide>
      <PopupContent />
    </PopupWithSigner>
  );
}

function OperationSelector({ onSelect, onClose }) {
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
  const [showOperationSelector, setShowOperationSelector] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <>
      <PrimaryButton
        size="small"
        onClick={() => setShowOperationSelector(true)}
      >
        Set Proxy
      </PrimaryButton>

      {showOperationSelector && (
        <OperationSelector
          onSelect={() => {
            setShowAddForm(true);
            setShowOperationSelector(false);
          }}
          onClose={() => setShowOperationSelector(false)}
        />
      )}

      {showAddForm && <AddProxyPopup onClose={() => setShowAddForm(false)} />}
    </>
  );
}
