import useSetIdentityDeposit from "next-common/hooks/people/useSetIdentityDeposit";
import RightWrapper from "next-common/components/rightWraper";
import { useState, useCallback, useEffect, useRef } from "react";
import Input from "next-common/lib/input";
import { toPrecision } from "next-common/utils";
import PopupLabel from "next-common/components/popup/label";
import CurrencyInput from "next-common/components/currencyInput";
import LoadableContent from "next-common/components/common/loadableContent";
import { useChainSettings } from "next-common/context/chain";
import useSubMyIdentityInfo from "next-common/hooks/people/useSubMyIdentityInfo";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useContextApi } from "next-common/context/api";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { formatIdentityInfo } from "next-common/components/people/common";
import { Label } from "../popup/styled";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";

const fields = [
  {
    title: "Display Name",
    key: "display",
    placeholder: "My On-Chain Name",
  },
  {
    title: "Legal Name",
    key: "legal",
    placeholder: "Full Legal Name",
  },
  {
    title: "Email",
    key: "email",
    type: "email",
    placeholder: "somebody@example.col",
  },
  {
    title: "Web",
    key: "web",
    type: "url",
    placeholder: "https://example.com",
  },
  {
    title: "Twitter",
    key: "twitter",
    placeholder: "@YourTwitterName",
  },
  {
    title: "Discord",
    key: "discord",
    placeholder: "YourDiscordHandle",
  },
  {
    title: "Matrix Name",
    key: "matrix",
    placeholder: "@yourname:matrix.org",
  },
  {
    title: "Github",
    key: "github",
    placeholder: "YourGithubHandle",
  },
];

export default function SetIdentityPopupContent() {
  const { decimals, symbol } = useChainSettings();
  const [identityInfo, setIdentityInfo] = useState({});
  const [errors, setErrors] = useState({});
  const { result: subMyIdentityInfo } = useSubMyIdentityInfo();
  const api = useContextApi();
  const dispatch = useDispatch();

  useEffect(() => {
    if (subMyIdentityInfo) {
      setIdentityInfo(subMyIdentityInfo);
    }
  }, [subMyIdentityInfo]);

  const updateIdentityInfo = useCallback((key, value) => {
    setIdentityInfo((prev) => ({ ...prev, [key]: value }));
  }, []);

  const { deposit, isLoading } = useSetIdentityDeposit(identityInfo);

  const getTxFunc = useCallback(() => {
    if (!api || !api?.tx?.identity) {
      return;
    }

    const info = formatIdentityInfo(identityInfo);

    return api.tx.identity.setIdentity(info);
  }, [identityInfo, api]);

  const onInBlock = useCallback(() => {
    dispatch(newSuccessToast("Set identity successfully"));
  }, [dispatch]);

  const hasErrors = Object.values(errors).some((error) => !!error);
  const isEmpty = Object.values(identityInfo).every((value) => !value);

  const isDisabled = hasErrors || isEmpty || !identityInfo?.display;

  return (
    <div className="space-y-4">
      <SignerWithBalance />
      {fields.map((field) => (
        <InputField
          key={field.key}
          field={field}
          errors={errors}
          setErrors={setErrors}
          identityInfo={identityInfo}
          onFieldChange={updateIdentityInfo}
        />
      ))}
      <div>
        <PopupLabel text="Deposit" />
        <CurrencyInput
          disabled
          value={isLoading ? "" : toPrecision(deposit || 0, decimals)}
          prefix={<LoadableContent isLoading={isLoading} />}
          symbol={symbol}
        />
      </div>
      <RightWrapper>
        <TxSubmissionButton
          title="Set Identity"
          getTxFunc={getTxFunc}
          onInBlock={onInBlock}
          disabled={isDisabled}
        />
      </RightWrapper>
    </div>
  );
}

function InputField({ field, identityInfo, onFieldChange, errors, setErrors }) {
  const inputRef = useRef(null);

  return (
    <div>
      <Label>{field.title}</Label>
      <Input
        ref={inputRef}
        name={field.key}
        errorClassName="leading-none"
        value={identityInfo[field.key] || ""}
        type={field.type || "text"}
        placeholder={field.placeholder || ""}
        onChange={(e) => {
          setErrors((prev) => ({
            ...prev,
            [field.key]: null,
          }));
          onFieldChange(field.key, e.target.value);
        }}
        onBlur={() => {
          setErrors((prev) => ({
            ...prev,
            [field.key]: inputRef.current.checkValidity?.()
              ? null
              : `Invalid ${field.title}`,
          }));
        }}
        error={errors[field.key]}
      />
    </div>
  );
}
