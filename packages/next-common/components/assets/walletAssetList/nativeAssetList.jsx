import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { MapDataList } from "next-common/components/dataList";
import CrossChainTransferButton from "../crossChainTransferButton";
import { useNativeTokenIcon } from "next-common/components/assets/known";
import {
  colTotal,
  colTransferrable,
} from "next-common/components/assets/assetsList";
import { useMyNativeAsset } from "next-common/components/assets/useMyAssets";

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
  render: () => <CrossChainTransferButton />,
};

const columnsDef = [colToken, colTotal, colTransferrable, teleport];

export default function NativeAssetList() {
  const { loading, value } = useMyNativeAsset();
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
