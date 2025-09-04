import { useChainSettings } from "next-common/context/chain";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import Divider from "next-common/components/styled/layout/divider";
import { usePageProps } from "next-common/context/page";
import { isNil } from "lodash-es";
import DvStatusTag from "next-common/components/tags/state/dv";
import dayjs from "dayjs";
import { TenureValue } from "next-common/components/referenda/dv/common/styled";
import { formatTimeDuration } from "next-common/utils/viewfuncs/formatTimeDuration";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";

export default function Overview() {
  const { cohort } = usePageProps();

  if (isNil(cohort)) return null;

  const hasGuardians = cohort?.guardianCnt > 0;

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
            <OverviewEachValue
              count={cohort.delegateCnt}
              eachValue={cohort.delegation}
            />
          </SummaryItem>
          {hasGuardians && (
            <SummaryItem title="Guardians">
              <OverviewEachValue
                count={cohort.guardianCnt}
                eachValue={cohort.guardianDelegation}
              />
            </SummaryItem>
          )}
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

function OverviewEachValue({ count, eachValue }) {
  const chainSettings = useChainSettings();

  return (
    <div className="flex flex-col gap-y-1">
      <span className="text16Bold">{count}</span>
      <span className="text-textSecondary text12Medium flex items-center gap-x-1 flex-wrap">
        <ValueDisplay
          value={toPrecision(eachValue, chainSettings.decimals)}
          showVerySmallNumber={true}
        />
        delegations each
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
      <span className="text-textSecondary text12Medium">
        #{blockHeight?.toLocaleString()}
      </span>
    </div>
  );
}
