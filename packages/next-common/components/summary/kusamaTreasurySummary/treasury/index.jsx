import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import FiatPriceLabel from "../common/fiatPriceLabel";
import { useKusamaTreasuryContext } from "next-common/context/treasury/kusamaTreasury";
import BigNumber from "bignumber.js";
import { useMemo } from "react";
import { useChain } from "next-common/context/chain";
import Link from "next/link";
import Tooltip from "next-common/components/tooltip";
import { KusamaAssetHubAccount } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";

export default function Treasury() {
  const {
    nativeTreasuryBalanceOnRelayChain,
    isNativeTreasuryBalanceOnRelayChainLoading,
    nativeTreasuryBalanceOnAssetHub,
    isNativeTreasuryBalanceOnAssetHubLoading,
  } = useKusamaTreasuryContext();

  const treasuryNativeBalance = useMemo(() => {
    return new BigNumber(nativeTreasuryBalanceOnRelayChain || 0).plus(
      nativeTreasuryBalanceOnAssetHub || 0,
    );
  }, [nativeTreasuryBalanceOnRelayChain, nativeTreasuryBalanceOnAssetHub]);

  return (
    <SummaryItem title="Treasury">
      <LoadableContent
        isLoading={
          isNativeTreasuryBalanceOnRelayChainLoading ||
          isNativeTreasuryBalanceOnAssetHubLoading
        }
      >
        <div className="flex flex-col gap-[4px]">
          <FiatPriceLabel free={treasuryNativeBalance} />
          <AddressLinks />
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}

function AddressLink({ account, index }) {
  const chain = useChain();
  return (
    <Link
      className="text12Medium"
      href={`https://assethub-${chain}.statescan.io/#/accounts/${account}`}
      target="_blank"
      rel="noreferrer"
    >
      <Tooltip
        content={`Treasury account #${index}`}
        className="flex flex-nowrap whitespace-nowrap"
      >
        <span className="text-textTertiary hover:underline">Addr #{index}</span>
        <i className="text-textTertiary">&nbsp;↗</i>
      </Tooltip>
    </Link>
  );
}

function AddressLinks() {
  const { treasuryAccount } = useKusamaTreasuryContext();
  return (
    <div className="gap-x-1 grid grid-cols-3 max-sm:grid-cols-2">
      <AddressLink account={treasuryAccount} index={1} />
      <AddressLink account={KusamaAssetHubAccount} index={2} />
    </div>
  );
}
