import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { MapDataList } from "next-common/components/dataList";
import {
  colTotal,
  colTransferrable,
} from "next-common/components/assets/assetsList";
import { useMyNativeAsset } from "next-common/hooks/assets/useMyNativeAsset";
import { useMemo } from "react";
import { isAssetHubMigrated } from "next-common/utils/consts/isAssetHubMigrated";
import { colToken } from "./columns/token";
import { colActions } from "./columns/actions";

function useColumnsDef() {
  const isMigrated = isAssetHubMigrated();

  return useMemo(() => {
    if (isMigrated) {
      return [colToken, colTotal, colTransferrable];
    }

    return [colToken, colTotal, colTransferrable, colActions];
  }, [isMigrated]);
}

export default function NativeAssetList() {
  const { loading, value } = useMyNativeAsset();
  const columnsDef = useColumnsDef();

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
