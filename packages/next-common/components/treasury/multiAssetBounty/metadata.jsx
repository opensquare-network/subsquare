import React, { memo } from "react";
import KVList from "next-common/components/listInfo/kvList";
import AddressUser from "next-common/components/user/addressUser";
import Copyable from "next-common/components/copyable";
import {
  useCurator,
  useCuratorParams,
} from "next-common/context/treasury/bounties";
import {
  CuratorBadge,
  CuratorProxyTag,
} from "next-common/components/treasury/bounty/styled";
import { isNil, omit, upperFirst } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import { getAssetInfoFromAssetKind } from "next-common/utils/treasury/multiAssetBounty/assetKind";
import Anchor from "next-common/components/styled/anchor";

function CuratorElement({ curator }) {
  const { badge, delegateAddress } = useCuratorParams() || {};

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

function MultiAssetBountyMetadata({
  id,
  meta,
  assetKind,
  address,
  description,
}) {
  const curator = useCurator();
  const { decimals: chainDecimals, symbol: chainSymbol } = useChainSettings();
  const { symbol, decimals } = getAssetInfoFromAssetKind(
    assetKind,
    chainDecimals,
    chainSymbol,
  );

  if (!meta) {
    return null;
  }

  const metadata = meta ? Object.entries(omit(meta, ["assetKind"])) : [];

  if (!isNil(id)) {
    metadata.unshift(["Id", `#${id}`]);
  }

  if (address) {
    metadata.push(["address", address]);
  }

  if (curator) {
    metadata.push(["curator", curator]);
  }

  if (description) {
    metadata.push(["description", description]);
  }

  const normalized = metadata.map(([key, value]) => {
    let normalizedValue = value;

    switch (key) {
      case "parentBounty":
        normalizedValue = (
          <Anchor href={`/treasury/multi-asset-bounties/${value}`}>
            {" "}
            #{value}{" "}
          </Anchor>
        );
        break;
      case "proposer":
      case "beneficiary":
        normalizedValue = <AddressUser add={value} />;
        break;
      case "curator":
        normalizedValue = <CuratorElement curator={curator} />;
        break;
      case "value":
        normalizedValue = (
          <ValueDisplay value={toPrecision(value, decimals)} symbol={symbol} />
        );
        break;
      case "status":
        normalizedValue =
          typeof value === "object" ? Object.keys(value)[0] : value;
        break;
      case "address":
        normalizedValue = <Copyable>{address}</Copyable>;
        break;
      case "description":
        normalizedValue = <span>{description}</span>;
        break;
    }

    return [upperFirst(key), normalizedValue];
  });

  return <KVList title="Metadata" data={normalized} showFold />;
}

export default memo(MultiAssetBountyMetadata);
