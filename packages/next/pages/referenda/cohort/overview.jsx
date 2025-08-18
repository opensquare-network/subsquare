import { useChainSettings } from "next-common/context/chain";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import Divider from "next-common/components/styled/layout/divider";
import { usePageProps } from "next-common/context/page";
import { isNil } from "lodash-es";
import DvStatusTag from "next-common/components/tags/state/dv";
import {
  ParticipationValue,
  W3fDelegationValue,
} from "next-common/components/referenda/dvs/common/cohortValueStyled";
import dayjs from "dayjs";
import tw from "tailwind-styled-components";

const TenureValue = tw.span`text-textSecondary text12Medium max-sm:hidden inline-block  before:mr-1 before:text-textTertiary`;

export default function Overview() {
  const { cohort } = usePageProps();

  const chainSettings = useChainSettings();
  const symbol = chainSettings.symbol;

  if (isNil(cohort)) return null;

  return (
    <NeutralPanel className="p-12">
      <div className="flex gap-x-1">
        <SummaryLayout>
          <SummaryItem title="Index">
            <span className="text16Bold">{cohort.id}</span>
          </SummaryItem>
        </SummaryLayout>
        <div>
          <DvStatusTag state={cohort.endIndexer ? "Closed" : "Ongoing"} />
        </div>
      </div>
      <Divider className="my-3" />
      <div className="flex gap-x-1">
        <SummaryLayout>
          <SummaryItem title="Delegates">
            <span className="text16Bold">{cohort.delegateCnt}</span>
          </SummaryItem>
          <SummaryItem title="W3F Delegation">
            <div className="flex flex-col gap-y-1">
              <W3fDelegationValue row={cohort} />
              <span className="text-textSecondary text12Medium">
                1M {symbol}*6x per DV
              </span>
            </div>
          </SummaryItem>
          <SummaryItem title="Participation">
            <div className="flex flex-col gap-y-1">
              <span>
                <ParticipationValue
                  value={cohort.delegateCnt / cohort.dvTrackReferendaCnt}
                />
              </span>
              <span className="text-textSecondary text12Medium">
                {cohort.delegateCnt}/{cohort.dvTrackReferendaCnt}
              </span>
            </div>
          </SummaryItem>
          <SummaryItem title="Tenure">
            <div className="flex flex-col gap-y-1">
              <div className="flex items-center gap-x-1">
                <span>4</span>
                <span className="text-textTertiary">mos</span>
              </div>
              {cohort.startIndexer && (
                <TenureValue className="before:content-['Start']">
                  {dayjs(cohort.startIndexer.blockTime).format("YYYY-MM-DD")}
                </TenureValue>
              )}
              {cohort.endIndexer && (
                <TenureValue className="before:content-['End']">
                  {dayjs(cohort.endIndexer.blockTime).format("YYYY-MM-DD")}
                </TenureValue>
              )}
            </div>
          </SummaryItem>
          <SummaryItem title="Start Time">
            <IndexerValue indexer={cohort.startIndexer} />
          </SummaryItem>
          {cohort.endIndexer && (
            <SummaryItem title="End Time">
              <IndexerValue indexer={cohort.endIndexer} />
            </SummaryItem>
          )}
        </SummaryLayout>
      </div>
    </NeutralPanel>
  );
}

function IndexerValue({ indexer }) {
  const blockTime = indexer?.blockTime;
  const blockHeight = indexer?.blockHeight;

  return (
    <div className="flex flex-col gap-y-1">
      <div className="flex items-center gap-x-1 max-sm:flex-col">
        <span>{dayjs(blockTime).format("YYYY-MM-DD")}</span>
        <span className="text-textTertiary self-start">
          {dayjs(blockTime).format("HH:mm:ss")}
        </span>
      </div>
      <span className="text-textSecondary text12Medium">#{blockHeight}</span>
    </div>
  );
}
