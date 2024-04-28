import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import CardHeader from "./cardHeader";
import { DetailList, DetailRow } from "./detailRow";
import { useBasicData } from "next-common/context/centrifuge/basicData";
import { bnToLocaleString } from "next-common/utils/bn";
import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "next-common/components/valueDisplay";
import LoadableContent from "next-common/components/common/loadableContent";

export default function BlockRewardsCard() {
  const { symbol } = useChainSettings();
  const { data = {}, loading: isLoading } = useBasicData();
  const { rewards = {} } = data;
  const { total = 0, collator = 0, treasury = 0 } = rewards;

  return (
    <SecondaryCard>
      <div className="flex flex-col gap-[16px]">
        <CardHeader
          title="Block Rewards"
          value={
            <LoadableContent isLoading={isLoading}>
              <ValueDisplay value={bnToLocaleString(total)} symbol={symbol} />
            </LoadableContent>
          }
        />
        <DetailList>
          <DetailRow
            title="Collator"
            value={
              <LoadableContent isLoading={isLoading}>
                <ValueDisplay
                  value={bnToLocaleString(collator)}
                  symbol={symbol}
                />
              </LoadableContent>
            }
          />
          <DetailRow
            title="Treasury"
            value={
              <LoadableContent isLoading={isLoading}>
                <ValueDisplay
                  value={bnToLocaleString(treasury)}
                  symbol={symbol}
                />
              </LoadableContent>
            }
          />
        </DetailList>
      </div>
    </SecondaryCard>
  );
}
