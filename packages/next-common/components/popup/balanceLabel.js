import React from "react";
import { LabelWrapper, Label, BalanceWrapper } from "./styled";
import Loading from "../loading";
import { formatBalance } from "../../utils/viewfuncs";

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
        <div>{balanceName}</div>
        {!isLoading && <div>{formatBalance(balance, symbol)}</div>}
        {isLoading && <Loading />}
      </BalanceWrapper>
    </LabelWrapper>
  );
}
