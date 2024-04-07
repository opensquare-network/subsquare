import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import CardHeader from "./cardHeader";
import { DetailList, DetailRow } from "./detailRow";
import TokenValue from "./tokenValue";
import { useBasicData } from "next-common/context/centrifuge/basicData";
import { formatBN } from "next-common/utils/bn";

export default function BlockRewardsCard() {
  const { data = {} } = useBasicData();
  const { rewards = {} } = data;
  const { total = 0, collator = 0, treasury = 0 } = rewards;

  return (
    <SecondaryCard>
      <div className="flex flex-col gap-[16px]">
        <CardHeader
          title="Block Rewards"
          value={<TokenValue value={formatBN(total)} />}
        />
        <DetailList>
          <DetailRow
            title="Collator"
            value={<TokenValue value={formatBN(collator)} />}
          />
          <DetailRow
            title="Treasury"
            value={<TokenValue value={formatBN(treasury)} />}
          />
        </DetailList>
      </div>
    </SecondaryCard>
  );
}
