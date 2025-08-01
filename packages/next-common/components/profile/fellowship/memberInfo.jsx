import { find } from "lodash-es";
import LoadableContent from "next-common/components/common/loadableContent";
import FellowshipRank from "next-common/components/fellowship/rank";
import SignalIndicator from "next-common/components/icons/signalIndicator";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import ValueDisplay from "next-common/components/valueDisplay";
import { usePageProps } from "next-common/context/page";
import useFellowshipCoreMembersWithRank from "next-common/hooks/fellowship/core/useFellowshipCoreMembersWithRank";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import { backendApi } from "next-common/services/nextApi";
import {
  ambassadorParamsApi,
  fellowshipParamsApi,
} from "next-common/services/url";
import { cn, toPrecision } from "next-common/utils";
import { FELLOWSHIP_RANK_LEVEL_NAMES } from "next-common/utils/constants";
import { useAsync } from "react-use";
import DemotionRemainLabel from "./demotionRemainLabel";
import PromotionRemainLabel from "./promotionRemainLabel";
import { getRankSalary } from "next-common/utils/fellowship/getRankSalary";
import { LastPayment } from "next-common/components/pages/fellowship/member/fellowshipMember/salary";
import Tooltip from "next-common/components/tooltip";
import { useMemo } from "react";

export default function ProfileFellowshipMemberInfo({
  section = "fellowship",
}) {
  const { id: address } = usePageProps();

  if (section === "fellowship") {
    return <ProfileFellowshipMemberInfoImpl address={address} />;
  } else if (section === "ambassador") {
    return <ProfileFellowshipAmbassadorMemberInfoImpl address={address} />;
  }

  return null;
}

function ProfileFellowshipMemberInfoImpl({ address }) {
  const { members } = useFellowshipCoreMembersWithRank();
  const member = find(members, { address });

  if (!member) {
    return null;
  }

  return (
    <ProfileFellowshipMemberInfoPanel
      member={member}
      paramsApi={fellowshipParamsApi}
    />
  );
}

function ProfileFellowshipAmbassadorMemberInfoImpl({ address }) {
  const { members } = useFellowshipCoreMembersWithRank();
  const member = find(members, { address });

  if (!member) {
    return null;
  }

  return (
    <ProfileFellowshipMemberInfoPanel
      member={member}
      paramsApi={ambassadorParamsApi}
    />
  );
}

function ProfileFellowshipMemberInfoPanel({ member, paramsApi }) {
  const { value: params = {}, loading } = useAsync(async () => {
    const resp = await backendApi.fetch(paramsApi);
    if (resp.result) {
      return resp.result;
    }
  });

  const { rank, status } = member;
  const { lastProof, lastPromotion, isActive } = status || {};

  return (
    <NeutralPanel className="p-6">
      <SummaryLayout className="grid-cols-3 gap-3">
        <SummaryItem title="Status">
          <div
            className={cn(
              "flex items-center gap-x-2",
              isActive ? "text-green500" : "text-textDisabled",
            )}
          >
            <SignalIndicator className="w-4 h-4" active={isActive} />
            {isActive ? "Active" : "Inactive"}
          </div>
        </SummaryItem>

        <SummaryItem title="Member">
          <div className="flex items-center gap-x-2">
            <FellowshipRank rank={rank} />
            {FELLOWSHIP_RANK_LEVEL_NAMES[rank]}
          </div>

          <div className="space-y-1 mt-3">
            <LoadableContent isLoading={loading}>
              <DemotionRemainLabel
                params={params}
                rank={rank}
                lastProof={lastProof}
              />
              <PromotionRemainLabel
                params={params}
                rank={rank}
                lastPromotion={lastPromotion}
              />
            </LoadableContent>
          </div>
        </SummaryItem>

        <MemberSalaryItem
          params={params}
          isActive={isActive}
          rank={rank}
          loading={loading}
        />
      </SummaryLayout>
    </NeutralPanel>
  );
}

function MemberSalaryItem({ params, isActive, rank, loading }) {
  const { activeSalary = [], passiveSalary = [] } = params;

  const { decimals, symbol } = getSalaryAsset();

  const salaryTable = isActive ? activeSalary : passiveSalary;
  const salary = getRankSalary(salaryTable, rank);

  const salaryValue = useMemo(() => {
    return toPrecision(salary, decimals);
  }, [salary, decimals]);

  const tooltipContent = useMemo(() => {
    if (isActive) {
      return `It's the active salary. Passive salary is ${salaryValue} when inactive.`;
    }
    return `It's the inactive salary. Active salary is ${salaryValue} when active.`;
  }, [isActive, salaryValue]);

  return (
    <SummaryItem
      title={
        <span className="flex items-center gap-x-1">
          Salary
          <Tooltip content={tooltipContent}></Tooltip>
        </span>
      }
    >
      <div className="flex flex-col items-end">
        <LoadableContent isLoading={loading}>
          <ValueDisplay value={toPrecision(salary, decimals)} symbol={symbol} />
        </LoadableContent>
        <LastPayment />
      </div>
    </SummaryItem>
  );
}
