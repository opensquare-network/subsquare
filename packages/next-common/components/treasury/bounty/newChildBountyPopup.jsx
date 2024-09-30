import React, { useCallback, useState } from "react";
import SimpleTxPopup from "next-common/components/simpleTxPopup";
import { useContextApi } from "next-common/context/api";
import AmountInputWithHint from "next-common/components/popup/fields/amountInputWithHint";
import { useChainSettings } from "next-common/context/chain";
import { useOnchainData } from "next-common/context/post";
import { useAccountAllTransferrable } from "next-common/hooks/useAccountTransferrable";
import BigNumber from "bignumber.js";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { toPrecision } from "next-common/utils";
import TextAreaField from "next-common/components/popup/fields/textAreaField";

function useTextAreaField({ title }) {
  const [text, setText] = useState("");
  return {
    value: text,
    component: <TextAreaField title={title} text={text} setText={setText} />,
  };
}

function useChildBountyBalanceField({ transferrable, isLoading }) {
  const [inputBalance, setInputBalance] = useState("");
  const { decimals, symbol } = useChainSettings();

  return {
    value: inputBalance,
    component: (
      <AmountInputWithHint
        label="Value"
        hintLabel="Available"
        hintTooltip="Available bounty balance"
        maxAmount={transferrable}
        decimals={decimals}
        symbol={symbol}
        isLoading={isLoading}
        inputAmount={inputBalance}
        setInputAmount={setInputBalance}
      />
    ),
  };
}

export default function NewChildBountyPopup({ bountyIndex, onClose }) {
  const dispatch = useDispatch();
  const { decimals } = useChainSettings();
  const api = useContextApi();
  const { address } = useOnchainData();
  const { transferrable, isLoading } = useAccountAllTransferrable(api, address);
  const { value: amount, component: balanceField } = useChildBountyBalanceField(
    { transferrable, isLoading },
  );
  const { value: description, component: descriptionField } = useTextAreaField({
    title: "Description",
  });

  const getTxFunc = useCallback(async () => {
    const balance = new BigNumber(amount).times(Math.pow(10, decimals));

    const childBountyValueMinimum =
      api.consts.childBounties.childBountyValueMinimum.toJSON();

    if (balance.lt(childBountyValueMinimum)) {
      dispatch(
        newErrorToast(
          `Child bounty value must not be less than ${toPrecision(
            childBountyValueMinimum,
            decimals,
          )}`,
        ),
      );
      return;
    }

    if (balance.gt(transferrable)) {
      dispatch(
        newErrorToast(
          "Child bounty value must not be greater than available balance",
        ),
      );
      return;
    }

    return api.tx.childBounties.addChildBounty(
      bountyIndex,
      balance.toString(),
      description,
    );
  }, [
    dispatch,
    api,
    bountyIndex,
    amount,
    description,
    transferrable,
    decimals,
  ]);

  return (
    <SimpleTxPopup
      className="w-[640px]"
      title="New Child Bounty"
      getTxFunc={getTxFunc}
      onClose={onClose}
    >
      {balanceField}
      {descriptionField}
    </SimpleTxPopup>
  );
}
