import React from "react";
import { LabelWrapper, Label, BalanceWrapper } from "./styled";
import { SystemLoadingDots } from "@osn/icons/subsquare";
import { formatBalance } from "../../utils/viewfuncs";
import NumberWithComma from "../numberWithComma";
import Tooltip from "../tooltip";

export default function PopupLabelWithBalance({
  text,
  balanceName,
  isLoading,
  balance,
  symbol,
  showTransferable = false,
}) {
  let content = (
    <NumberWithComma value={formatBalance(balance, symbol)} symbol={symbol} />
  );
  if (showTransferable) {
    content = <Tooltip content="Transferable balance">{content}</Tooltip>;
  }

  return (
    <LabelWrapper>
      <Label>{text}</Label>
      <BalanceWrapper>
        <div className="text-textTertiary text14Medium">{balanceName}</div>
        {isLoading ? (
          <SystemLoadingDots width={20} height={20} />
        ) : (
          <div>{content}</div>
        )}
      </BalanceWrapper>
    </LabelWrapper>
  );
}
