import ExistentialDeposit from "next-common/components/popup/fields/existentialDepositField";
import Signer from "next-common/components/popup/fields/signerField";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import { useContextApi } from "next-common/context/api";
import PrimaryButton from "next-common/lib/button/primary";
import RightWrapper from "next-common/components/rightWraper";
import { SystemPlus } from "@osn/icons/subsquare";
import { useState, useCallback, useMemo, useEffect } from "react";
import { SubItem } from "./subItem";
import useSubscribeMySubIdentities from "next-common/hooks/people/useSubscribeMySubIdentities";
import LoadableContent from "../common/loadableContent";

export default function SetIdentityPopupContent() {
  const api = useContextApi();
  const [subsMap, setSubsMap] = useState({});
  const [subsOrder, setSubsOrder] = useState([]);
  const { subs, isLoading } = useSubscribeMySubIdentities();

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
      <Signer balance={0} isBalanceLoading={false} symbol="DOT" />

      <LoadableContent isLoading={isLoading}>
        {subsOrder.map((id) => (
          <SubItem
            key={id}
            subId={id}
            sub={subsMap[id]}
            updateSubField={updateSubField}
            onRemove={removeSub}
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
        <ExistentialDeposit destApi={api} title="Deposit" />
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
