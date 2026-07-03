import React from "react";
import { cn } from "next-common/utils";
import Divider from "next-common/components/styled/layout/divider";
import { isNil } from "lodash-es";
import ListPostTitle from "next-common/components/postList/postTitle";
import Tooltip from "next-common/components/tooltip";
import { CuratorProvider } from "next-common/context/treasury/bounties";
import { useCuratorMultisigAddress } from "next-common/hooks/treasury/bounty/useCuratorMultisigAddress";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import Curator from "next-common/components/treasury/bounty/bountyCardSection/curator";
import { useCurator } from "next-common/context/treasury/bounties";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import { getAssetInfoFromAssetKind } from "next-common/utils/treasury/multiAssetBounty/assetKind";
import useAssetBalance from "next-common/hooks/treasury/useAssetBalance";
import LoadableContent from "next-common/components/common/loadableContent";
import { useMemo } from "react";
import MultiAssetBountyCardHeaderLabel from "./cardHeaderLabel";
import MultiAssetBountyCardChildBounties from "./cardChildBounties";

function CardValueAndCurator({ item }) {
  const { address, assetKind } = item?.onchainData ?? {};
  const { decimals: chainDecimals, symbol: chainSymbol } = useChainSettings();
  const curator = useCurator();

  const assetInfo = useMemo(() => {
    return getAssetInfoFromAssetKind(assetKind, chainDecimals, chainSymbol);
  }, [assetKind, chainDecimals, chainSymbol]);

  const { symbol, decimals } = assetInfo ?? {};
  const { balance, loading } = useAssetBalance(address, assetInfo);

  if (!address) return null;

  return (
    <SummaryLayout className="mt-4 mb-3 flex">
      <SummaryItem title="Balance">
        <LoadableContent isLoading={loading}>
          <ValueDisplay
            value={toPrecision(balance ?? 0, decimals)}
            symbol={symbol}
          />
        </LoadableContent>
      </SummaryItem>
      <SummaryItem title="Curator">
        {curator ? <Curator /> : <span className="text12Medium">-</span>}
      </SummaryItem>
    </SummaryLayout>
  );
}

function MultiAssetBountyCardContent({ item }) {
  const curator = item?.onchainData?.curator;
  const curatorParams = useCuratorMultisigAddress(curator);

  return (
    <CuratorProvider curator={curator} params={curatorParams}>
      <MultiAssetBountyCardHeaderLabel data={item} />
      <Tooltip content={item.title} className="my-3">
        <ListPostTitle data={item} href={item.detailLink} ellipsis />
      </Tooltip>
      <Divider />
      <CardValueAndCurator item={item} />
      <Divider />
      <MultiAssetBountyCardChildBounties bountyIndex={item.bountyIndex} />
    </CuratorProvider>
  );
}

function MultiAssetBountyCard({ item, className = "" }) {
  if (isNil(item)) return null;

  return (
    <div
      className={cn(
        "bg-neutral100",
        "p-6",
        "shadow-100",
        "rounded-[12px]",
        "border",
        "border-neutral300",
        className,
      )}
    >
      <MultiAssetBountyCardContent item={item} />
    </div>
  );
}

export default React.memo(MultiAssetBountyCard);
