import { useEffect } from "react";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { MapDataList } from "next-common/components/dataList";
import {
  colId,
  colName,
  colToken,
  useColTotal,
  useColTransferrable,
} from "next-common/components/assets/common/columns";
import { useQueryAddressAssets } from "next-common/components/assets/useSubAssetBalance";
import { useTotalCounts } from "next-common/components/assets/context/assetHubTabsProvider";

export default function ProfileAssetsList({ address }) {
  const { loading, assets } = useQueryAddressAssets(address);
  const [totalCounts, setTotalCount] = useTotalCounts();
  const colTotal = useColTotal(address);
  const colTransferrable = useColTransferrable(address);

  const columnsDef = [colToken, colId, colName, colTotal, colTransferrable];

  useEffect(() => {
    if (loading || assets?.length === totalCounts.assets) {
      return;
    }

    setTotalCount("assets", assets?.length || 0);
  }, [assets, setTotalCount, loading, totalCounts.assets]);

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
