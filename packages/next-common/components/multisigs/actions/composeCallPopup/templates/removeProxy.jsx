import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import EstimatedGas from "next-common/components/estimatedGas";
import { ProxyTypeSelector } from "next-common/components/myProxies/operations/popup/addProxy";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import PreviousButton from "next-common/components/summary/newProposalButton/previousButton";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import { useContextApi } from "next-common/context/api";
import { useStepContainer } from "next-common/context/stepContainer";
import { useTxBuilder } from "next-common/hooks/useTxBuilder";
import { isSameAddress } from "next-common/utils";
import { useState } from "react";
import MultisigPopupWrapper from "../multisigPopupWraper";

function RemoveProxyContent() {
  const api = useContextApi();
  const [proxyType, setProxyType] = useState("Any");
  const { value: proxyAccount, component: proxyAccountField } =
    useAddressComboField({ title: "Proxy Account" });
  const { goBack } = useStepContainer();
  const signerAccount = useSignerAccount();
  const address = signerAccount?.realAddress;
  const delay = 0;

  const { getTxFuncForSubmit, getTxFuncForFee } = useTxBuilder(
    (toastError) => {
      if (!api || !address) {
        return;
      }

      if (!proxyType) {
        toastError("The proxy type is required");
        return;
      }

      if (!proxyAccount) {
        toastError("The proxy account is required");
        return;
      }

      if (isSameAddress(address, proxyAccount)) {
        toastError("Cannot set yourself as proxy");
        return;
      }

      return api.tx.proxy.addProxy(proxyAccount, proxyType, delay);
    },
    [api, address, proxyType, proxyAccount, delay],
  );

  return (
    <>
      <ProxyTypeSelector proxyType={proxyType} setProxyType={setProxyType} />
      {proxyAccountField}
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFuncForFee} />
      </AdvanceSettings>
      <div className="flex justify-between">
        <PreviousButton onClick={goBack} />
        <TxSubmissionButton getTxFunc={getTxFuncForSubmit} />
      </div>
    </>
  );
}

export default function RemoveProxy() {
  return (
    <MultisigPopupWrapper>
      <RemoveProxyContent />
    </MultisigPopupWrapper>
  );
}
