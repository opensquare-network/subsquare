import React, { memo } from "react";
import KVList from "../../listInfo/kvList";
import { getNode, toPrecision } from "../../../utils";
import Anchor from "../../styled/anchor";
import UserWithLink from "../../user/userWithLink";

/**
 *
 * @param meta {proposer, beneficiary, value, bond, status}
 * @param chain {string}
 * @constructor
 */
function BountyMetadata({ meta, chain }) {
  const node = getNode(chain);
  if (!node) {
    throw new Error(`Can not get node info for chain ${chain}`);
  }
  const { symbol, decimals } = node;

  if (!meta) {
    return null;
  }

  const metadata = meta ? Object.entries(meta) : [];
  const normalized = metadata.map(([key, value]) => {
    let normalizedValue = value;

    switch (key) {
      case "parentBounty":
        normalizedValue = (
          <Anchor href={`/treasury/bounty/${value}`}> #{value} </Anchor>
        );
        break;
      case "proposer":
      case "beneficiary":
        normalizedValue = <UserWithLink chain={chain} address={value} />;
        break;
      case "value":
      case "fee":
      case "curatorDeposit":
      case "bond":
        normalizedValue = `${toPrecision(value ?? 0, decimals)} ${symbol}`;
        break;
      case "status":
        normalizedValue = Object.keys(value)[0];
    }

    return [key, normalizedValue];
  });

  return <KVList title="Metadata" data={normalized} showFold />;
}

export default memo(BountyMetadata);
