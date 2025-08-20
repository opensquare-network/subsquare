import { useChainSettings } from "next-common/context/chain";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import Divider from "next-common/components/styled/layout/divider";
import { usePageProps } from "next-common/context/page";
import { groupBy, isNil } from "lodash-es";
import DvStatusTag from "next-common/components/tags/state/dv";
import {
  ParticipationValue,
  W3fDelegationValue,
} from "next-common/components/referenda/dvs/common/cohortValueStyled";
import dayjs from "dayjs";
import tw from "tailwind-styled-components";
import { formatTimeDuration } from "next-common/utils/viewfuncs/formatTimeDuration";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import BigNumber from "bignumber.js";
import { useReferendaDvCount } from "next-common/context/referenda/dv";

const TenureValue = tw.span`text-textSecondary text12Medium max-sm:hidden inline-block  before:mr-1 before:text-textTertiary`;

export default function Overview() {
  const { cohort } = usePageProps();

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
            <OverviewW3fDelegationValue cohort={cohort} />
          </SummaryItem>
          <SummaryItem title="Participation">
            <OverviewParticipationValue />
          </SummaryItem>
          {cohort.startIndexer && cohort.endIndexer && (
            <SummaryItem title="Tenure">
              <div className="flex flex-col gap-y-1">
                <div className="flex items-center gap-x-1">
                  <span>
                    {formatTimeDuration(
                      cohort.endIndexer.blockTime -
                        cohort.startIndexer.blockTime,
                    )}
                  </span>
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
          )}
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

function OverviewW3fDelegationValue({ cohort }) {
  const chainSettings = useChainSettings();
  const perDV = BigNumber(cohort.delegation).div(cohort.delegateCnt);

  return (
    <div className="flex flex-col gap-y-1">
      <W3fDelegationValue value={cohort.delegation} />
      <span className="text-textSecondary text12Medium flex items-center gap-x-1">
        <ValueDisplay
          value={toPrecision(perDV, chainSettings.decimals)}
          showVerySmallNumber={true}
        />
        <span>*</span>
        <span>{cohort.delegateCnt}x per DV</span>
      </span>
    </div>
  );
}

function OverviewParticipationValue() {
  const { votes } = usePageProps();
  const count = useReferendaDvCount();
  const voteCount = Object.values(groupBy(votes, "referendumIndex")).length;

  return (
    <div className="flex flex-col gap-y-1">
      <span>
        <ParticipationValue voteCount={voteCount} totalCount={count} />
      </span>
      <span className="text-textSecondary text12Medium">
        {voteCount}/{count}
      </span>
    </div>
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
