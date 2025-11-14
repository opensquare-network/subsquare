import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { MapDataList } from "next-common/components/dataList";
import {
  colTotal,
  colTransferrable,
} from "next-common/components/assethubMigrationAssets/assetsList";
import { useMyNativeAsset } from "next-common/hooks/assets/useMyNativeAsset";
import { colToken } from "./columns/token";
import { colTransfer } from "./columns/transfer";

export default function NativeAssetList() {
  const { loading, value } = useMyNativeAsset();
  const columnsDef = [colToken, colTotal, colTransferrable, colTransfer];

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
