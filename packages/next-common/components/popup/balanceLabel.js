import React from "react";
import { LabelWrapper, Label, BalanceWrapper } from "./styled";
import { SystemLoadingDots } from "@osn/icons/subsquare";
import { formatBalance } from "../../utils/viewfuncs";
import NumberWithComma from "../numberWithComma";

export default function PopupLabelWithBalance({
  text,
  balanceName,
  isLoading,
  balance,
  symbol,
}) {
  return (
    <LabelWrapper>
      <Label>{text}</Label>
      <BalanceWrapper>
        <div className="text-textTertiary text14Medium">{balanceName}</div>
        {isLoading ? (
          <SystemLoadingDots width={20} height={20} />
        ) : (
          <div>
            <NumberWithComma
              value={formatBalance(balance, symbol)}
              symbol={symbol}
            />
          </div>
        )}
      </BalanceWrapper>
    </LabelWrapper>
  );
}
