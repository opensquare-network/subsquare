import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { MapDataList } from "next-common/components/dataList";
import ParaChainTeleportButton from "../paraChainTeleportContextButton";
import { useNativeTokenIcon } from "next-common/components/assets/known";
import {
  colTotal,
  colTransferrable,
} from "next-common/components/assets/assetsList";
import { useMyNativeAsset } from "next-common/hooks/assets/useMyNativeAsset";
import { useMemo } from "react";
import { isAssetHubMigrated } from "next-common/utils/consts/isAssetHubMigrated";

function TokenSymbol({ symbol }) {
  const NativeAssetIcon = useNativeTokenIcon();
  return (
    <div className="flex gap-[8px] items-center text14Medium text-textPrimary">
      <NativeAssetIcon width={24} height={24} /> {symbol}
    </div>
  );
}

const colToken = {
  name: "Token",
  style: { textAlign: "left", minWidth: "160px" },
  render: (item) => <TokenSymbol key="token" symbol={item?.symbol} />,
};

const teleport = {
  name: "",
  style: { textAlign: "right", width: "80px", minWidth: "80px" },
  render: () => <ParaChainTeleportButton />,
};

function useColumnsDef() {
  const isMigrated = isAssetHubMigrated();

  return useMemo(() => {
    if (isMigrated) {
      return [colToken, colTotal, colTransferrable];
    }

    return [colToken, colTotal, colTransferrable, teleport];
  }, [isMigrated]);
}

export default function NativeAssetList() {
  const { loading, value } = useMyNativeAsset();
  const columnsDef = useColumnsDef();

  return (
    <ScrollerX>
      <MapDataList
        columnsDef={columnsDef}
        data={[value]}
        loading={loading}
        noDataText="No current assets"
      />
    </ScrollerX>
  );
}
