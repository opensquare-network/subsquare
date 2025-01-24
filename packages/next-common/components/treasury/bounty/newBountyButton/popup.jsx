import BigNumber from "bignumber.js";
import CurrencyInput from "next-common/components/currencyInput";
import Labeled from "next-common/components/Labeled";
import AmountInputWithHint from "next-common/components/popup/fields/amountInputWithHint";
import SimpleTxPopup from "next-common/components/simpleTxPopup";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import { usePolkadotTreasury } from "next-common/context/treasury/polkadotTreasury";
import useBountyBond from "next-common/hooks/treasury/bounty/useBountyBond";
import Input from "next-common/lib/input";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { fromPrecision, toPrecision } from "next-common/utils";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

export default function NewBountyPopup({ onClose }) {
  const router = useRouter();
  const { decimals, symbol } = useChainSettings();
  const api = useContextApi();
  const dispatch = useDispatch();
  const [inputAmount, setInputAmount] = useState("");
  const [inputTitle, setInputTitle] = useState("");

  const {
    dotTreasuryBalanceOnBounties: bountiesBalance,
    isDotTreasuryBalanceOnBountiesLoading: isLoading,
  } = usePolkadotTreasury();

  const { bond } = useBountyBond(inputTitle);

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

    if (balance.gt(bountiesBalance)) {
      dispatch(
        newErrorToast(
          "Bounty value must not be greater than available balance",
        ),
      );
      return;
    }

    return api.tx.bounties.proposeBounty(balance.toString(), inputTitle);
  }, [inputAmount, decimals, api, bountiesBalance, inputTitle, dispatch]);

  return (
    <SimpleTxPopup
      title="New Bounty"
      onClose={onClose}
      getTxFunc={getTxFunc}
      onInBlock={async () => {
        const bountyId = await api.query.bounties.bountyCount();
        if (bountyId.isEmpty) {
          return;
        }

        router.push(`/treasury/bounties/${bountyId.toNumber()}`);
      }}
    >
      <AmountInputWithHint
        label="Value"
        hintLabel="Bounties"
        maxAmount={bountiesBalance}
        isLoading={isLoading}
        decimals={decimals}
        symbol={symbol}
        hintSymbol={symbol}
        inputAmount={inputAmount}
        setInputAmount={setInputAmount}
      />

      <Labeled text="Title">
        <Input
          placeholder="Please fill the title..."
          value={inputTitle}
          onValueChange={setInputTitle}
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
