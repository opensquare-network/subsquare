import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import CardHeader from "./cardHeader";
import { DetailList, DetailRow } from "./detailRow";
import useCfgBasicData from "next-common/context/centrifuge/basicData";
import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "next-common/components/valueDisplay";
import LoadableContent from "next-common/components/common/loadableContent";

export default function BlockRewardsCard() {
  const { symbol } = useChainSettings();
  const [{ data = {}, loading: isLoading }] = useCfgBasicData();
  const { rewards = {} } = data;
  const { total = 0, collator = 0, treasury = 0 } = rewards;

  return (
    <SecondaryCard>
      <div className="flex flex-col gap-[16px]">
        <CardHeader
          title="Block Rewards"
          value={
            <LoadableContent isLoading={isLoading}>
              <ValueDisplay value={total} symbol={symbol} />
            </LoadableContent>
          }
        />
        <DetailList>
          <DetailRow
            title="Collator"
            value={
              <LoadableContent isLoading={isLoading}>
                <ValueDisplay value={collator} symbol={symbol} />
              </LoadableContent>
            }
          />
          <DetailRow
            title="Treasury"
            value={
              <LoadableContent isLoading={isLoading}>
                <ValueDisplay value={treasury} symbol={symbol} />
              </LoadableContent>
            }
          />
        </DetailList>
      </div>
    </SecondaryCard>
  );
}
