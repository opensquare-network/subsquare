import BigNumber from "bignumber.js";
import AmountInputWithHint from "next-common/components/popup/fields/amountInputWithHint";
import EditorField from "next-common/components/popup/fields/editorField";
import SimpleTxPopup from "next-common/components/simpleTxPopup";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { fromPrecision, toPrecision } from "next-common/utils";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { usePolkadotTreasury } from "next-common/context/treasury/polkadotTreasury";

export default function NewBountyPopup({ onClose }) {
  const router = useRouter();
  const { decimals, symbol } = useChainSettings();
  const api = useContextApi();
  const dispatch = useDispatch();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const {
    dotTreasuryBalanceOnBounties: bountiesBalance,
    isDotTreasuryBalanceOnBountiesLoading: isLoading,
  } = usePolkadotTreasury();

  const getTxFunc = useCallback(async () => {
    const balance = BigNumber(fromPrecision(amount, decimals));

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

    return api.tx.bounties.proposeBounty(balance.toString(), description);
  }, [amount, decimals, api, bountiesBalance, description, dispatch]);

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
        inputAmount={amount}
        setInputAmount={setAmount}
      />

      <EditorField
        title="Description"
        content={description}
        setContent={setDescription}
      />
    </SimpleTxPopup>
  );
}
