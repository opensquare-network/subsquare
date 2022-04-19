import React from "react";
import { LabelWrapper, Label, BalanceWrapper } from "./styled";
import Loading from "next-common/components/loading";

export default function PopupLabelWithBalance({
  text,
  balanceName,
  isLoading,
  balance,
}) {
  return (
    <LabelWrapper>
      <Label>{text}</Label>
      <BalanceWrapper>
        <div>{balanceName}</div>
        {!isLoading && <div>{balance}</div>}
        {isLoading && <Loading />}
      </BalanceWrapper>
    </LabelWrapper>
  );
}
