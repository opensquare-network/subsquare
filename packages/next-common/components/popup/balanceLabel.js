import React from "react";
import { LabelWrapper, Label, BalanceWrapper } from "./styled";
import Loading from "../loading";
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
        {!isLoading && (
          <div>
            <NumberWithComma
              value={formatBalance(balance, symbol)}
              symbol={symbol}
            />
          </div>
        )}
        {isLoading && <Loading />}
      </BalanceWrapper>
    </LabelWrapper>
  );
}
