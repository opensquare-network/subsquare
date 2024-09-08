import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import CardHeader from "./cardHeader";
import { DetailList, DetailRow } from "./detailRow";
import useCfgBasicData from "next-common/context/centrifuge/basicData";
import Tooltip from "next-common/components/tooltip";
import LoadableContent from "next-common/components/common/loadableContent";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";

export default function GovernanceCard() {
  const { symbol } = useChainSettings();
  const [{ data = {}, loading: isLoading }] = useCfgBasicData();
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
          value={
            <LoadableContent isLoading={isLoading}>
              <ValueDisplay value={onChain} symbol={symbol} />
            </LoadableContent>
          }
        />
        <DetailList>
          <DetailRow
            title="On chain"
            value={
              <LoadableContent isLoading={isLoading}>
                <ValueDisplay value={onChain} symbol={symbol} />
              </LoadableContent>
            }
          />
          <DetailRow
            title="Off chain"
            value={
              <LoadableContent isLoading={isLoading}>
                <ValueDisplay value={offChain} symbol={symbol} />
              </LoadableContent>
            }
          />
        </DetailList>
      </div>
    </SecondaryCard>
  );
}
