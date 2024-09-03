import React, { memo } from "react";
import KVList from "../../listInfo/kvList";
import Anchor from "../../styled/anchor";
import SymbolBalance from "../../values/symbolBalance";
import AddressUser from "next-common/components/user/addressUser";
import Copyable from "next-common/components/copyable";
import {
  useCurator,
  useCuratorParams,
} from "next-common/context/treasury/bounties";
import { CuratorBadge, CuratorProxyTag } from "./curator";

function CuratorElement() {
  const curator = useCurator();
  const { badge, delegateAddress } = useCuratorParams();

  if (!curator) {
    return null;
  }

  return (
    <div className="flex items-center flex-wrap space-x-2">
      <AddressUser key={curator} add={curator} />
      {badge && <CuratorBadge badge={badge} />}
      {delegateAddress && <CuratorProxyTag />}
    </div>
  );
}

/**
 *
 * @param meta {proposer, beneficiary, value, bond, status}
 * @constructor
 */
function BountyMetadata({ meta, address }) {
  const curator = useCurator();

  if (!meta) {
    return null;
  }

  const metadata = meta ? Object.entries(meta) : [];
  if (address) {
    metadata.push(["address", address]);
  }

  if (curator) {
    const curatorDepositIndex = metadata.findIndex(
      ([key]) => key === "curatorDeposit",
    );

    const curatorEntry = ["curator", curator];
    if (curatorDepositIndex !== -1) {
      metadata.splice(curatorDepositIndex, 0, curatorEntry);
    } else {
      metadata.push(curatorEntry);
    }
  }

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
        normalizedValue = <AddressUser add={value} />;
        break;
      case "curator":
        normalizedValue = CuratorElement();
        break;
      case "value":
      case "fee":
      case "curatorDeposit":
      case "bond":
        normalizedValue = <SymbolBalance value={value} />;
        break;
      case "status":
        normalizedValue = Object.keys(value)[0];
        break;
      case "address":
        normalizedValue = <Copyable>{address}</Copyable>;
        break;
    }

    return [key, normalizedValue];
  });

  return <KVList title="Metadata" data={normalized} showFold />;
}

export default memo(BountyMetadata);
