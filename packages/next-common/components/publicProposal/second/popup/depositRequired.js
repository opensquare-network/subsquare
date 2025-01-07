import React from "react";
import PopupLabel from "../../../popup/label";
import { WarningMessage } from "../../../popup/styled";
import { toPrecision } from "../../../../utils";
import { useChainSettings } from "../../../../context/chain";
import CurrencyInput from "next-common/components/currencyInput";

export default function DepositRequired({ deposit, balanceInsufficient }) {
  const node = useChainSettings();

  return (
    <>
      <div>
        <PopupLabel
          text={"Deposit"}
          tooltip={
            "The deposit will be locked for the lifetime of the proposal"
          }
        />
        <CurrencyInput
          disabled
          value={toPrecision(deposit, node.decimals)}
          symbol={node?.voteSymbol ?? node?.symbol}
        />
      </div>
      {balanceInsufficient && (
        <WarningMessage danger>Insufficient balance</WarningMessage>
      )}
    </>
  );
}
