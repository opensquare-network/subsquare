import { useState } from "react";
import PopupWithSigner from "next-common/components/popupWithSigner";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
// import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import Select from "next-common/components/select";
import NumberInput from "next-common/lib/input/number";
import { InfoMessage } from "next-common/components/setting/styled";
import Link from "next/link";
import { useProxyTypeOptions } from "../../hooks/useProxyTypeOptions";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { isSameAddress } from "next-common/utils";
import { useTxBuilder } from "next-common/hooks/useTxBuilder";
import EstimatedGas from "next-common/components/estimatedGas";

export function DelayBlocksField({ value, setValue }) {
  const PROXY_WIKI_LINK =
    "https://wiki.polkadot.network/docs/learn-proxies#time-delayed-proxy";
  const PROMPT_CONTENT =
    "The proxy will announce its intended action immediately.";

  return (
    <div>
      <span className="text-textPrimary">Delay Blocks</span>
      <NumberInput
        className="mt-2"
        value={value}
        symbol="Blocks"
        controls={false}
        onValueChange={setValue}
      />
      <InfoMessage className="mt-2">
        <span className="text-textSecondary text14Medium">
          {PROMPT_CONTENT}&nbsp;
          <Link className="underline" href={PROXY_WIKI_LINK} target="_blank">
            Wiki
          </Link>
          ↗
        </span>
      </InfoMessage>
    </div>
  );
}

function ProxyTypeSelector({ proxyType, setProxyType }) {
  const { options, isLoading } = useProxyTypeOptions();

  if (isLoading) {
    return null;
  }

  const typeOptions = options.map((type) => ({
    value: type,
    label: type,
  }));

  return (
    <div>
      <div className="text-textPrimary text12Bold mb-3">Proxy Type</div>
      <Select
        small
        className="w-full !h-[40px] text14Medium"
        value={proxyType}
        options={typeOptions}
        onChange={({ value }) => {
          setProxyType(value);
        }}
      />
    </div>
  );
}

// TODO: delay options
// TODO: advance settings
function PopupContent() {
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const address = signerAccount?.realAddress;
  const dispatch = useDispatch();
  const { value: proxyAccount, component: proxyAccountField } =
    useAddressComboField({ title: "Proxy Account" });
  const [proxyType, setProxyType] = useState("Any");
  // const [delay, setDelay] = useState(0);
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

  const onFinalized = () => {
    dispatch(newSuccessToast("Added successfully"));
  };

  return (
    <div className="space-y-4">
      <SignerWithBalance />
      <ProxyTypeSelector proxyType={proxyType} setProxyType={setProxyType} />
      {proxyAccountField}
      {/* <AdvanceSettings>
          <DelayBlocksField value={delay} setValue={setDelay} />
        </AdvanceSettings> */}
      <EstimatedGas getTxFunc={getTxFuncForFee} />
      <TxSubmissionButton
        getTxFunc={getTxFuncForSubmit}
        onFinalized={onFinalized}
      />
    </div>
  );
}

export default function AddProxyPopup({ onClose }) {
  return (
    <PopupWithSigner title="Add a proxy" onClose={onClose}>
      <PopupContent onClose={onClose} />
    </PopupWithSigner>
  );
}
