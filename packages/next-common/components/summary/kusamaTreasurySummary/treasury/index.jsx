import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import FiatPriceLabel from "../common/fiatPriceLabel";
import { useKusamaTreasuryContext } from "next-common/context/treasury/kusamaTreasury";
import BigNumber from "bignumber.js";
import { useMemo } from "react";
import { useChain } from "next-common/context/chain";
import AddressLinks from "next-common/components/styled/addressLinks";
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
          <TreasuryAddressLinks />
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}

function TreasuryAddressLinks() {
  const chain = useChain();
  const { treasuryAccount } = useKusamaTreasuryContext();
  return (
    <AddressLinks
      items={[
        {
          href: `https://assethub-${chain}.statescan.io/#/accounts/${treasuryAccount}`,
          tooltip: "Treasury account #1",
        },
        {
          href: `https://assethub-${chain}.statescan.io/#/accounts/${KusamaAssetHubAccount}`,
          tooltip: "Treasury account #2",
        },
      ]}
    />
  );
}
