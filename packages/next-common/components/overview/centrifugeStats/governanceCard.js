import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import CardHeader from "./cardHeader";
import { DetailList, DetailRow } from "./detailRow";
import TokenValue from "./tokenValue";
import { useBasicData } from "next-common/context/centrifuge/basicData";
import { formatBN } from "next-common/utils/bn";
import Tooltip from "next-common/components/tooltip";

export default function GovernanceCard() {
  const { data = {} } = useBasicData();
  const { governanceToken = {} } = data;
  const { onChain = 0, offChain = 0 } = governanceToken;

  return (
    <SecondaryCard>
      <div className="flex flex-col gap-[16px]">
        <CardHeader
          title={
            <div className="flex gap-[4px] items-center">
              <span>Tokens Used in Governance</span>
              <Tooltip content="Average turnout of the latest 10 proposals" />
            </div>
          }
          value={<TokenValue value={formatBN(onChain)} />}
        />
        <DetailList>
          <DetailRow
            title="On chain"
            value={<TokenValue value={formatBN(onChain)} />}
          />
          <DetailRow
            title="Off chain"
            value={<TokenValue value={formatBN(offChain)} />}
          />
        </DetailList>
      </div>
    </SecondaryCard>
  );
}
