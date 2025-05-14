import ScrollerX from "next-common/components/styled/containers/scrollerX";
import { MapDataList } from "next-common/components/dataList";
import ParaChainTeleportButton from "../paraChainTeleportButton";
import { useNativeTokenIcon } from "next-common/components/assets/known";
import { formatBalance } from "next-common/components/assets/assetsList";
import { useMyNativeAsset } from "next-common/hooks/assets/useMyNativeAsset";
import BalanceDisplay from "../balanceDisplay";
import { useSubBalanceInfo } from "next-common/hooks/balance/useSubBalanceInfo";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

function TokenSymbol({ symbol }) {
  const NativeAssetIcon = useNativeTokenIcon();
  return (
    <div className="flex gap-[8px] items-center text14Medium text-textPrimary">
      <NativeAssetIcon width={24} height={24} /> {symbol}
    </div>
  );
}

function Transferrable({ transferrable, decimals }) {
  const address = useRealAddress();
  const { value } = useSubBalanceInfo(address);
  return (
    <span className="text14Medium text-textPrimary">
      <BalanceDisplay
        balance={formatBalance(value?.transferrable || transferrable, decimals)}
      />
    </span>
  );
}

function Balance({ balance, decimals }) {
  const address = useRealAddress();
  const { value } = useSubBalanceInfo(address);
  return (
    <span className="text14Medium text-textPrimary">
      <BalanceDisplay
        balance={formatBalance(value?.balance || balance, decimals)}
      />
    </span>
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

const colTotal = {
  name: "Total",
  style: { textAlign: "right", width: "160px", minWidth: "160px" },
  render: (item) => (
    <Balance key="total" balance={item.balance} decimals={item.decimals} />
  ),
};

const colTransferrable = {
  name: "Transferrable",
  style: { textAlign: "right", width: "160px", minWidth: "160px" },
  render: (item) => (
    <Transferrable
      key="transferrable"
      transferrable={item.transferrable}
      decimals={item.decimals}
    />
  ),
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
