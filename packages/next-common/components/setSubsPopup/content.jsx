import RightWrapper from "next-common/components/rightWraper";
import { SystemPlus } from "@osn/icons/subsquare";
import { useState, useCallback, useMemo, useEffect } from "react";
import { SubItem } from "./subItem";
import LoadableContent from "../common/loadableContent";
import {
  useExtensionAccounts,
  usePopupParams,
} from "../popupWithSigner/context";
import CurrencyInput from "../currencyInput";
import { cn, toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import useSetSubsDeposit from "next-common/hooks/people/useSetSubsDeposit";
import { useContextApi } from "next-common/context/api";
import TxSubmissionButton from "../common/tx/txSubmissionButton";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import SignerWithBalance from "../signerPopup/signerWithBalance";
import { Label } from "../popup/styled";
import { noop } from "lodash-es";
import WindowSizeProvider from "next-common/context/windowSize";

const defaultSub = {
  address: "",
  name: "",
};

export default function SetSubsPopupContent() {
  const { subs, retry = noop } = usePopupParams();
  const api = useContextApi();
  const dispatch = useDispatch();
  const extensionAccounts = useExtensionAccounts();
  const [subsList, setSubsList] = useState([]);

  const defaultAddress = useMemo(() => {
    const defaultSelectAccount = extensionAccounts
      .map((item) => item.address)
      .find((ext) => !subsList.map((sub) => sub.address).includes(ext));
    return defaultSelectAccount || extensionAccounts?.[0]?.address || "";
  }, [subsList, extensionAccounts]);

  useEffect(() => {
    if (subs) {
      setSubsList(
        subs.length
          ? subs.map(([address, subName]) => ({ address, name: subName }))
          : [{ ...defaultSub, address: extensionAccounts?.[0]?.address || "" }],
      );
    }
  }, [subs, extensionAccounts]);

  const addressList = useMemo(
    () => subsList.map((sub) => sub.address),
    [subsList],
  );

  const addSub = useCallback(() => {
    setSubsList((prev) => [...prev, { address: defaultAddress, name: "" }]);
  }, [defaultAddress]);

  const removeSub = useCallback((index) => {
    setSubsList((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateSubField = useCallback((index, field, value) => {
    setSubsList((prev) =>
      prev.map((sub, i) => (i === index ? { ...sub, [field]: value } : sub)),
    );
  }, []);

  const submitIsDisabled = useMemo(() => {
    return subsList.some((sub) => !sub.address || !sub.name);
  }, [subsList]);

  const getTxFunc = useCallback(() => {
    if (!api?.tx?.identity) return;

    const validSubs = subsList.filter((sub) => sub.address && sub.name);

    return api.tx.identity.setSubs(
      validSubs.map((sub) => [sub.address, { Raw: sub.name }]),
    );
  }, [api, subsList]);

  const onFinalized = useCallback(() => {
    dispatch(newSuccessToast("Finalized subs successfully"));
    retry?.();
  }, [dispatch, retry]);

  return (
    <WindowSizeProvider>
      <div className="space-y-4">
        <SignerWithBalance />

        {subsList.map((sub, index) => (
          <SubItem
            key={index}
            subId={index}
            sub={sub}
            selectedList={addressList}
            updateSubField={(field, value) =>
              updateSubField(index, field, value)
            }
            onRemove={() => removeSub(index)}
            extensionAccounts={extensionAccounts}
          />
        ))}

        <AddSubsButton addSub={addSub} />

        <SubsDeposit selectedList={addressList} />

        <RightWrapper>
          <TxSubmissionButton
            disabled={submitIsDisabled}
            title="Submit"
            getTxFunc={getTxFunc}
            onFinalized={onFinalized}
          />
        </RightWrapper>
      </div>
    </WindowSizeProvider>
  );
}

function AddSubsButton({ addSub }) {
  return (
    <RightWrapper className="text-theme500">
      <div
        className={cn(
          "inline-flex gap-x-1 items-center cursor-pointer text14Medium",
        )}
        onClick={addSub}
      >
        <SystemPlus className="w-4 h-4" />
        <span>Add Sub</span>
      </div>
    </RightWrapper>
  );
}

export function SubsDeposit({ selectedList }) {
  const chainSettings = useChainSettings();
  const { deposit, isLoading: isDepositLoading } =
    useSetSubsDeposit(selectedList);

  return (
    <>
      <Label>Deposit</Label>
      <CurrencyInput
        disabled
        value={
          isDepositLoading
            ? ""
            : toPrecision(deposit || 0, chainSettings.decimals)
        }
        prefix={<LoadableContent isLoading={isDepositLoading} />}
        symbol={chainSettings.symbol}
      />
    </>
  );
}
