import React from "react";
import BalanceInput from "../../../balanceInput";
import { getNode, toPrecision } from "utils";
import useDeposit from "./useDeposit";
import PopupLabel from "../../../popup/label";
import { WarningMessage } from "../../../popup/styled";

export default function DepositRequired({ chain, depositRequired }) {
  const { deposit, balanceInsufficient } = useDeposit(chain, depositRequired);

  const node = getNode(chain);

  return (
    <>
      <div>
        <PopupLabel
          text={"Deposit"}
          tooltip={
            "The deposit will be locked for the lifetime of the proposal"
          }
        />
        <BalanceInput
          disabled={true}
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
