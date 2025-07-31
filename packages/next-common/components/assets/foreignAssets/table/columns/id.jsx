import React, { useMemo } from "react";
import { isNil } from "lodash-es";
import { addressEllipsis } from "next-common/utils";
import { useChain, useChainSettings } from "next-common/context/chain";
import { getRelayChain } from "next-common/utils/chain";
import Link from "next/link";

function AssetIDWithoutLink({ assetId }) {
  return <span className="text-textTertiary">{addressEllipsis(assetId)}</span>;
}

function AssetIDWithLink({ assetId }) {
  const chain = useChain();
  const relayChain = getRelayChain(chain);

  const link = useMemo(() => {
    return `https://assethub-${relayChain}.statescan.io/#/foreign-assets/${assetId}`;
  }, [assetId, relayChain]);

  return (
    <Link className="text14Medium" href={link} target="_blank">
      {isNil(assetId) ? (
        "-"
      ) : (
        <span className="text-theme500">{addressEllipsis(assetId)}</span>
      )}
    </Link>
  );
}

function AssetID({ assetId }) {
  const { supportForeignAssets = false } = useChainSettings();

  if (!supportForeignAssets) {
    return <AssetIDWithoutLink assetId={assetId} />;
  }

  return <AssetIDWithLink assetId={assetId} />;
}

export const colId = {
  name: "ID",
  style: { textAlign: "left", width: "120px", minWidth: "120px" },
  render: (item) => <AssetID assetId={item.assetId} />,
};
