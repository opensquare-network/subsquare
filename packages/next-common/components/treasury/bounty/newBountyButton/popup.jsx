import BigNumber from "bignumber.js";
import CurrencyInput from "next-common/components/currencyInput";
import Labeled from "next-common/components/Labeled";
import SimpleTxPopup from "next-common/components/simpleTxPopup";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import useBountyBond from "next-common/hooks/treasury/bounty/useBountyBond";
import Input from "next-common/lib/input";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { fromPrecision, toPrecision } from "next-common/utils";
import { getEventData } from "next-common/utils/sendTransaction";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

export default function NewBountyPopup({ onClose }) {
  const router = useRouter();
  const { decimals, symbol } = useChainSettings();
  const api = useContextApi();
  const dispatch = useDispatch();
  const [inputAmount, setInputAmount] = useState("");
  const [inputDescription, setInputDescription] = useState("");

  const { bond } = useBountyBond(inputDescription);

  const getTxFunc = useCallback(async () => {
    const balance = BigNumber(fromPrecision(inputAmount, decimals));

    const bountyValueMinimum =
      api.consts.bounties.bountyValueMinimum.toString();

    if (balance.lt(bountyValueMinimum)) {
      dispatch(
        newErrorToast(
          `Bounty value must not be less than ${toPrecision(
            bountyValueMinimum,
            decimals,
          )}`,
        ),
      );
      return;
    }

    return api.tx.bounties.proposeBounty(balance.toString(), inputDescription);
  }, [inputAmount, decimals, api, inputDescription, dispatch]);

  return (
    <SimpleTxPopup
      title="New Bounty"
      onClose={onClose}
      getTxFunc={getTxFunc}
      onInBlock={async ({ events }) => {
        const eventData = getEventData(events, "bounties", "BountyProposed");
        if (!eventData) {
          return;
        }

        const [bountyId] = eventData;
        router.push(`/treasury/bounties/${bountyId}`);
      }}
    >
      <Labeled text="Value">
        <CurrencyInput
          placeholder="0"
          symbol={symbol}
          value={inputAmount}
          onValueChange={setInputAmount}
        />
      </Labeled>

      <Labeled text="Description">
        <Input
          placeholder="Please fill the description..."
          value={inputDescription}
          onValueChange={setInputDescription}
        />
      </Labeled>

      <AdvanceSettings>
        <Labeled text="Bounty Bond">
          <CurrencyInput
            disabled
            value={toPrecision(bond, decimals)}
            symbol={symbol}
          />
        </Labeled>
      </AdvanceSettings>
    </SimpleTxPopup>
  );
}
