import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { MapDataList } from "next-common/components/dataList";
import {
  colTotal,
  colTransferrable,
} from "next-common/components/assets/assetsList";
import { useMyNativeAsset } from "next-common/hooks/assets/useMyNativeAsset";
import { colToken } from "./columns/token";

export default function NativeAssetList() {
  const { loading, value } = useMyNativeAsset();
  const columnsDef = [colToken, colTotal, colTransferrable];

  return (
    <div className="relative">
      <ScrollerX>
        <MapDataList
          columnsDef={columnsDef}
          data={[value]}
          loading={loading}
          noDataText="No current assets"
        />
      </ScrollerX>
    </div>
  );
}
