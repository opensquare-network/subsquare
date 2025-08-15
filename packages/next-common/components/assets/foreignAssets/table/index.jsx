import { useEffect } from "react";
import { useMyForeignAssetsContext } from "next-common/context/foreignAssets";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { MapDataList } from "next-common/components/dataList";
import { foreignAssetsColumnsDef } from "./columns/index";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TransferPopupProvider } from "./transferPopup/context";
import ForeignAssetTransferPopup from "./transferPopup";
import { useTotalCounts } from "next-common/components/assets/context/assetHubTabsProvider";
import { useChainSettings } from "next-common/context/chain";

export default function ForeignAssetsTable() {
  const { assets, loading } = useMyForeignAssetsContext();
  const [, setTotalCount] = useTotalCounts();
  const { supportForeignAssets } = useChainSettings();

  useEffect(() => {
    if (!supportForeignAssets) {
      return;
    }

    setTotalCount("assets", assets?.length);
  }, [assets, setTotalCount, supportForeignAssets]);

  return (
    <TransferPopupProvider>
      <SecondaryCard>
        <ScrollerX>
          <MapDataList
            columnsDef={foreignAssetsColumnsDef}
            data={assets}
            loading={loading}
            noDataText="No current foreign assets"
          />
        </ScrollerX>
      </SecondaryCard>
      <ForeignAssetTransferPopup />
    </TransferPopupProvider>
  );
}
