import { useState, useCallback } from "react";
import PopupWithSigner from "next-common/components/popupWithSigner";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";
// import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import Select from "next-common/components/select";
import Input from "next-common/components/input";
import { InfoMessage } from "next-common/components/setting/styled";
import Link from "next/link";
import { useProxyTypeOptions } from "../../hooks/useProxyTypeOptions";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";

export function DelayBlocksField({ value, setValue }) {
  const PROXY_WIKI_LINK =
    "https://wiki.polkadot.network/docs/learn-proxies#time-delayed-proxy";
  const PROMPT_CONTENT =
    "The proxy will announce its intended action immediately.";

  const handleInputChange = (e) => {
    const inputValue = e.target.value.trim();
    setValue(inputValue);
  };

  return (
    <div>
      <span className="text-textPrimary text14Bold">Delay Blocks</span>
      <Input
        className="mt-2"
        value={value}
        symbol="Blocks"
        onChange={handleInputChange}
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
      <span className="text-textPrimary text14Bold">Type</span>
      <Select
        small
        className="w-full !h-[40px] text14Medium !mt-2"
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
function PopupContent({ onClose }) {
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const dispatch = useDispatch();
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

  const onFinalized = () => {
    dispatch(newSuccessToast("Added successfully"));
  };

  return (
    <div className="space-y-6">
      <SignerWithBalance title="Account" />
      {proxyAccountField}
      <ProxyTypeSelector proxyType={proxyType} setProxyType={setProxyType} />
      {/* <AdvanceSettings>
          <DelayBlocksField value={delay} setValue={setDelay} />
        </AdvanceSettings> */}
      <TxSubmissionButton
        getTxFunc={getTxFunc}
        onClose={onClose}
        onFinalized={onFinalized}
      />
    </div>
  );
}

export default function AddProxyPopup({ onClose }) {
  return (
    <PopupWithSigner
      title="Add Proxy"
      onClose={onClose}
      wide
      className="!w-[640px]"
    >
      <PopupContent onClose={onClose} />
    </PopupWithSigner>
  );
}
