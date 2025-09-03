import { useEffect } from "react";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { MapDataList } from "next-common/components/dataList";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { useTotalCounts } from "next-common/components/assets/context/assetHubTabsProvider";
import { useChainSettings } from "next-common/context/chain";
import { useProfileForeignAssetsContext } from "./context";
import { colId } from "next-common/components/assets/foreignAssets/table/columns/id";
import { colToken } from "next-common/components/assets/foreignAssets/table/columns/token";
import { colTotal } from "next-common/components/assets/foreignAssets/table/columns/total";
import { colTransferable } from "next-common/components/assets/foreignAssets/table/columns/transferable";

export default function ProfileForeignAssetsTable() {
  const { assets, loading } = useProfileForeignAssetsContext();
  const [, setTotalCount] = useTotalCounts();
  const { supportForeignAssets } = useChainSettings();

  useEffect(() => {
    if (!supportForeignAssets) {
      return;
    }

    setTotalCount("assets", assets?.length);
  }, [assets, setTotalCount, supportForeignAssets]);

  const columnsDef = [colToken, colId, colTotal, colTransferable];
  return (
    <div className="flex flex-col gap-[16px]">
      <SecondaryCard>
        <ScrollerX>
          <MapDataList
            columnsDef={columnsDef}
            data={assets}
            loading={loading}
            noDataText="No current foreign assets"
          />
        </ScrollerX>
      </SecondaryCard>
    </div>
  );
}
