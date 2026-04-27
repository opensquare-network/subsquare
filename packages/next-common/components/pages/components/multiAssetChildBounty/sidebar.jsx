import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import { useOnchainData } from "next-common/context/post";
import BountySidebarCurator from "next-common/components/treasury/bounty/curator";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { Value } from "next-common/components/referenda/tally/styled";
import { InfoUser, SystemCoins } from "@osn/icons/subsquare";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import { getAssetInfoFromAssetKind } from "next-common/utils/treasury/multiAssetBounty/assetKind";
import MultiAssetChildBountyMeta from "next-common/components/treasury/multiAssetChildBounty/metadata";
import useAssetBalance from "next-common/hooks/treasury/useAssetBalance";
import {
  CardDetailTitle,
  CardDetailRow,
  CopyableAddress,
} from "next-common/components/treasury/bounty/balance";

function MultiAssetChildBountySidebarBalance() {
  const { address, assetKind } = useOnchainData();
  const { decimals: chainDecimals, symbol: chainSymbol } = useChainSettings();
  const { symbol, decimals } = getAssetInfoFromAssetKind(
    assetKind,
    chainDecimals,
    chainSymbol,
  );
  const { balance, loading } = useAssetBalance(address, symbol);

  if (!address) {
    return null;
  }

  return (
    <SecondaryCardDetail>
      <CardDetailTitle title="Balance" />
      <CardDetailRow
        icon={<SystemCoins />}
        title="Balance"
        isLoading={loading}
        value={
          <ValueDisplay
            value={toPrecision(balance ?? 0, decimals)}
            symbol={symbol}
          />
        }
      />
      <CardDetailRow
        icon={<InfoUser />}
        title="Address"
        value={
          <Value>
            <CopyableAddress address={address} />
          </Value>
        }
      />
    </SecondaryCardDetail>
  );
}

function MultiAssetChildBountySidebar() {
  const { address, curator } = useOnchainData();

  if (!address && !curator) {
    return null;
  }

  return (
    <RightBarWrapper>
      <MultiAssetChildBountySidebarBalance />
      <BountySidebarCurator />
      <MultiAssetChildBountyMeta />
    </RightBarWrapper>
  );
}

export default MultiAssetChildBountySidebar;
