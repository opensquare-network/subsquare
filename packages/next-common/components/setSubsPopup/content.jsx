import Signer from "next-common/components/popup/fields/signerField";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import PrimaryButton from "next-common/lib/button/primary";
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

export default function SetIdentityPopupContent() {
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

  const submit = useCallback(async (subs) => {
    try {
      console.info(subs);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const submitIsDisabled = useMemo(() => {
    return hasEmptySub(subsMap);
  }, [subsMap]);

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
        <PrimaryButton
          className="w-auto"
          onClick={submit}
          disabled={submitIsDisabled}
        >
          Set Identity
        </PrimaryButton>
      </RightWrapper>
    </div>
  );
}

function hasEmptySub(subsMap) {
  return Object.values(subsMap).some(
    (sub) => sub.address === "" || sub.name === "",
  );
}
