import AddressUser from "next-common/components/user/addressUser";
import React from "react";
import KVList from "next-common/components/listInfo/kvList";
import HeightWithTime from "next-common/components/common/block/heightWithTime";
import useTreasurySpendRequest from "next-common/hooks/treasury/spend/useTreasurySpendRequest";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecisionNumber } from "next-common/utils";

export default function TreasurySpendMetadata({ spend = {} }) {
  const meta = spend?.meta || {};
  const proposer = spend?.proposer;
  const { validFrom, expireAt } = meta;
  const { amount, symbol, decimals, beneficiary } =
    useTreasurySpendRequest(meta);

  const data = [];
  if (proposer) {
    data.push(["Proposer", <AddressUser add={proposer} key="proposer" />]);
  }
  if (symbol) {
    data.push([
      "Request",
      <div
        key="request"
        className="flex gap-[8px] items-center text14Medium text-textPrimary"
      >
        <ValueDisplay
          value={toPrecisionNumber(amount, decimals)}
          symbol={symbol}
        />
        <span className="text-textTertiary">to</span>
        <AddressUser add={beneficiary} />
      </div>,
    ]);
  }
  if (validFrom) {
    data.push([
      "Valid From",
      <HeightWithTime height={validFrom} key="valid-from" />,
    ]);
  }
  if (expireAt) {
    data.push([
      "Expire At",
      <HeightWithTime height={expireAt} key="expire-at" />,
    ]);
  }

  return <KVList title="Metadata" data={data} showFold />;
}
