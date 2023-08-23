import React, { memo } from "react";
import KVList from "../../listInfo/kvList";
import Anchor from "../../styled/anchor";
import User from "../../user";
import SymbolBalance from "../../values/symbolBalance";

/**
 *
 * @param meta {proposer, beneficiary, value, bond, status}
 * @constructor
 */
function BountyMetadata({ meta }) {
  if (!meta) {
    return null;
  }

  const metadata = meta ? Object.entries(meta) : [];
  const normalized = metadata.map(([key, value]) => {
    let normalizedValue = value;

    switch (key) {
      case "parentBounty":
        normalizedValue = (
          <Anchor href={`/treasury/bounties/${value}`}> #{value} </Anchor>
        );
        break;
      case "proposer":
      case "beneficiary":
        normalizedValue = <User add={value} fontSize={14} />;
        break;
      case "value":
      case "fee":
      case "curatorDeposit":
      case "bond":
        normalizedValue = <SymbolBalance value={value} />;
        break;
      case "status":
        normalizedValue = Object.keys(value)[0];
    }

    return [key, normalizedValue];
  });

  return <KVList title="Metadata" data={normalized} showFold />;
}

export default memo(BountyMetadata);
