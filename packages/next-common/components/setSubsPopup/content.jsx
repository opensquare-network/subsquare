import Signer from "next-common/components/popup/fields/signerField";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import RightWrapper from "next-common/components/rightWraper";
import { SystemPlus } from "@osn/icons/subsquare";
import { useState, useCallback, useMemo, useEffect } from "react";
import { SubItem } from "./subItem";
import useSubscribeMySubIdentities from "next-common/hooks/people/useSubscribeMySubIdentities";
import LoadableContent from "../common/loadableContent";
import { useExtensionAccounts } from "../popupWithSigner/context";
import CurrencyInput from "../currencyInput";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import useSetSubsDeposit from "next-common/hooks/people/useSetSubsDeposit";
import { useContextApi } from "next-common/context/api";
import TxSubmissionButton from "../common/tx/txSubmissionButton";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";

export default function SetIdentityPopupContent() {
  const api = useContextApi();
  const dispatch = useDispatch();
  const chainSettings = useChainSettings();
  const [subsMap, setSubsMap] = useState({});
  const [subsOrder, setSubsOrder] = useState([]);
  const { subs, isLoading } = useSubscribeMySubIdentities();
  const extensionAccounts = useExtensionAccounts();
  const { deposit, isLoading: isDepositLoading } = useSetSubsDeposit();

  useEffect(() => {
    if (subs) {
      setSubsMap(
        subs.reduce((acc, [address, subName]) => {
          acc[address] = { address, name: subName };
          return acc;
        }, {}),
      );
      setSubsOrder(subs.map(([address]) => address));
    }
  }, [subs]);

  const addSub = useCallback(() => {
    const id = Date.now().toString();
    setSubsMap((prev) => ({
      ...prev,
      [id]: { address: "", name: "" },
    }));
    setSubsOrder((prev) => [...prev, id]);
  }, []);

  const removeSub = useCallback((id) => {
    setSubsMap((prev) => {
      const newMap = { ...prev };
      delete newMap[id];
      return newMap;
    });
    setSubsOrder((prev) => prev.filter((item) => item !== id));
  }, []);

  const updateSubField = useCallback((id, field, value) => {
    setSubsMap((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  }, []);

  const submitIsDisabled = useMemo(() => {
    return hasEmptySub(subsMap);
  }, [subsMap]);

  const getTxFunc = useCallback(() => {
    if (!api || !api?.tx?.identity) {
      return;
    }

    const subs = Object.values(subsMap).filter(
      (sub) => sub.address && sub.name,
    );

    if (!subs.length) {
      return;
    }

    return api.tx.identity.setSubs(
      subs.map((sub) => [sub.address, { Raw: sub.name }]),
    );
  }, [api, subsMap]);

  const onInBlock = useCallback(() => {
    dispatch(newSuccessToast("Submit subs successfully"));
  }, [dispatch]);

  return (
    <div className="space-y-4">
      <Signer
        balance={0}
        isBalanceLoading={false}
        symbol={chainSettings.symbol}
      />

      <LoadableContent isLoading={isLoading}>
        {subsOrder.map((id) => (
          <SubItem
            key={id}
            subId={id}
            sub={subsMap[id]}
            updateSubField={updateSubField}
            onRemove={removeSub}
            extensionAccounts={extensionAccounts}
          />
        ))}
      </LoadableContent>

      <RightWrapper
        className="flex gap-x-1 text-theme500 cursor-pointer items-center text14Medium"
        onClick={addSub}
      >
        <SystemPlus className="w-4 h-4" />
        <span>Add Sub</span>
      </RightWrapper>

      <AdvanceSettings>
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
      </AdvanceSettings>

      <RightWrapper>
        <TxSubmissionButton
          disabled={submitIsDisabled}
          title="Submit"
          getTxFunc={getTxFunc}
          onInBlock={onInBlock}
        />
      </RightWrapper>
    </div>
  );
}

function hasEmptySub(subsMap) {
  return Object.values(subsMap).some(
    (sub) => sub.address === "" || sub.name === "",
  );
}
