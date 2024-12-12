import { useState, useEffect } from "react";
import { SystemTransfer } from "@osn/icons/subsquare";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { MapDataList } from "next-common/components/dataList";
import ListButton from "next-common/components/styled/listButton";
import Tooltip from "../tooltip";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useQueryAddressAssets } from "next-common/components/assets/useSubAssetBalance";
import {
  colToken,
  colId,
  colName,
  useColTotal,
  useColTransferrable,
} from "next-common/components/assets/common/columns";
import { useTotalCounts } from "next-common/components/assets/context/assetHubTabsProvider";

const AssetTransferPopup = dynamicPopup(() => import("./transferPopup"));

function TransferButton({ asset }) {
  const [showPopup, setShowPopup] = useState(false);

  let popup = null;
  if (asset.type !== "native") {
    popup = (
      <AssetTransferPopup asset={asset} onClose={() => setShowPopup(false)} />
    );
  }

  return (
    <>
      <Tooltip content="Transfer">
        <ListButton
          onClick={() => {
            setShowPopup(true);
          }}
        >
          <SystemTransfer width={16} height={16} />
        </ListButton>
      </Tooltip>
      {showPopup && popup}
    </>
  );
}

export const colTransfer = {
  name: "",
  style: { textAlign: "right", width: "80px", minWidth: "80px" },
  render: (item) => <TransferButton asset={item} />,
};

export default function AssetsList({ address }) {
  const { loading, assets } = useQueryAddressAssets(address);
  const [totalCounts, setTotalCount] = useTotalCounts();
  const colTotal = useColTotal(address);
  const colTransferrable = useColTransferrable(address);

  useEffect(() => {
    if (loading || assets?.length === totalCounts.assets) {
      return;
    }

    setTotalCount("assets", assets?.length || 0);
  }, [assets, setTotalCount, loading, totalCounts.assets]);

  const columnsDef = [
    colToken,
    colId,
    colName,
    colTotal,
    colTransferrable,
    colTransfer,
  ];

  return (
    <ScrollerX>
      <MapDataList
        columnsDef={columnsDef}
        data={assets}
        loading={loading}
        noDataText="No current assets"
      />
    </ScrollerX>
  );
}
