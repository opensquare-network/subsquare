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
  showTransferableBalance = false,
  transferrable,
}) {
  let content = (
    <NumberWithComma value={formatBalance(balance, symbol)} symbol={symbol} />
  );
  if (showTransferableBalance && transferrable) {
    content = (
      <TransferableContent symbol={symbol} transferrable={transferrable}>
        {content}
      </TransferableContent>
    );
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

function TransferableContent({ children, symbol, transferrable }) {
  const tooltipContent = (
    <>
      Transferable:{" "}
      <NumberWithComma
        value={formatBalance(transferrable, symbol)}
        symbol={symbol}
      />
    </>
  );

  return <Tooltip content={tooltipContent}>{children}</Tooltip>;
}
