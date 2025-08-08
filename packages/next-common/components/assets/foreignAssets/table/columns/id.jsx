import { useMemo, useState, memo } from "react";
import { isNil } from "lodash-es";
import { addressEllipsis } from "next-common/utils";
import { useChain, useChainSettings } from "next-common/context/chain";
import { getRelayChain } from "next-common/utils/chain";
import Link from "next/link";
import { InfoDocs } from "@osn/icons/subsquare";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { cn } from "next-common/utils";

const LocationDetailPopup = dynamicPopup(() =>
  import("next-common/components/callDetailPopup"),
);

function LocationInfoIcon({ location }) {
  const [showDetail, setShowDetail] = useState(false);
  if (!location) {
    return null;
  }

  return (
    <>
      <InfoDocs
        role="button"
        className={cn("w-5 h-5 cursor-pointer", "[&_path]:fill-textSecondary")}
        onClick={() => setShowDetail(true)}
      />
      {showDetail && (
        <LocationDetailPopup
          tableViewData={location}
          jsonViewData={location}
          hasTreeViewData={false}
          setShow={setShowDetail}
          title="Location"
        />
      )}
    </>
  );
}

export const Location = memo(LocationInfoIcon);

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

export function AssetID({ assetId }) {
  const { supportForeignAssets = false } = useChainSettings();
  if (!supportForeignAssets) {
    return <AssetIDWithoutLink assetId={assetId} />;
  }

  return <AssetIDWithLink assetId={assetId} />;
}

export const colId = {
  name: "ID",
  style: { textAlign: "left", width: "120px", minWidth: "120px" },
  render: (item) => (
    <div className="flex items-center justify-between gap-x-2">
      <AssetID assetId={item.assetId} />
      <Location location={item.location} />
    </div>
  ),
};
