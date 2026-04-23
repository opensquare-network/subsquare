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
import { upperFirst } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import { getAssetInfoFromAssetKind } from "next-common/utils/treasury/multiAssetBounty/assetKind";

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

function AssetKindDisplay({ assetKind }) {
  if (!assetKind) return null;

  // Show the raw assetKind as a compact JSON string
  return (
    <span className="text12Medium text-textSecondary break-all">
      {JSON.stringify(assetKind)}
    </span>
  );
}

function MultiAssetBountyMetadata({ id, meta, assetKind, address }) {
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

  const metadata = meta ? Object.entries(meta) : [];

  if (id !== undefined && id !== null) {
    metadata.unshift(["Id", `#${id}`]);
  }

  if (assetKind) {
    metadata.push(["assetKind", assetKind]);
  }

  if (address) {
    metadata.push(["address", address]);
  }

  if (curator) {
    metadata.push(["curator", curator]);
  }

  const normalized = metadata.map(([key, value]) => {
    let normalizedValue = value;

    switch (key) {
      case "proposer":
      case "beneficiary":
        normalizedValue = <AddressUser add={value} />;
        break;
      case "curator":
        normalizedValue = <CuratorElement curator={curator} />;
        break;
      case "value":
      case "fee":
        normalizedValue = (
          <ValueDisplay value={toPrecision(value, decimals)} symbol={symbol} />
        );
        break;
      case "assetKind":
        normalizedValue = <AssetKindDisplay assetKind={value} />;
        break;
      case "status":
        normalizedValue =
          typeof value === "object" ? Object.keys(value)[0] : value;
        break;
      case "paymentIds":
        normalizedValue = Array.isArray(value)
          ? value.join(", ") || "-"
          : value;
        break;
      case "address":
        normalizedValue = <Copyable>{address}</Copyable>;
        break;
    }

    return [upperFirst(key), normalizedValue];
  });

  return <KVList title="Metadata" data={normalized} showFold />;
}

export default memo(MultiAssetBountyMetadata);
