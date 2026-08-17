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
import { useSalaryAsset } from "next-common/hooks/fellowship/salary/useSalaryAsset";
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

  if (section !== "fellowship" && section !== "ambassador") {
    return null;
  }

  return (
    <ProfileFellowshipMemberInfoImpl address={address} section={section} />
  );
}

function ProfileFellowshipMemberInfoImpl({ address, section }) {
  const { fellowshipMembers, ambassadorMembers } = usePageProps();
  const { members: chainMembers, loading: chainLoading } =
    useFellowshipCoreMembersWithRank();
  const { params, loading: paramsLoading } = useFellowshipParams(section);

  // Member data provided by backend/SSR (contains rank, no status)
  const ssrMembers =
    section === "fellowship" ? fellowshipMembers : ambassadorMembers;
  const ssrMember = find(ssrMembers || [], { address });
  // Chain queried data (contains rank and status), preferred
  const chainMember = find(chainMembers || [], { address });

  // Prefer chain data, fall back to SSR data while chain is not ready
  const member = chainMember || ssrMember;

  if (!member) {
    return null;
  }

  // Chain query finished but the member was not found, SSR data is stale, hide the panel
  if (!chainLoading && !chainMember) {
    return null;
  }

  return (
    <ProfileFellowshipMemberInfoPanel
      member={member}
      params={params}
      // status only exists on chain, not provided by SSR; show loading while chain is not ready
      statusLoading={chainLoading && !chainMember}
      paramsLoading={paramsLoading}
    />
  );
}

function useFellowshipParams(section) {
  const { fellowshipParams, ambassadorParams } = usePageProps();
  const ssrParams =
    section === "fellowship" ? fellowshipParams : ambassadorParams;
  const paramsApi =
    section === "fellowship" ? fellowshipParamsApi : ambassadorParamsApi;

  // Use SSR params directly if provided; otherwise fall back to a client request
  const { value: fetchedParams, loading: fetchLoading } = useAsync(async () => {
    if (ssrParams) {
      return undefined;
    }
    const resp = await backendApi.fetch(paramsApi);
    if (resp.result) {
      return resp.result;
    }
  });

  const params = ssrParams || fetchedParams || {};
  const loading = !ssrParams && fetchLoading;

  return { params, loading };
}

function ProfileFellowshipMemberInfoPanel({
  member,
  params,
  statusLoading,
  paramsLoading,
}) {
  const { rank, status } = member;
  const { lastProof, lastPromotion, isActive } = status || {};

  const loading = statusLoading || paramsLoading;

  return (
    <NeutralPanel className="p-6">
      <SummaryLayout className="grid-cols-3 max-sm:grid-cols-1">
        <SummaryItem title="Status">
          <LoadableContent isLoading={loading}>
            <div
              className={cn(
                "flex items-center gap-x-2",
                isActive ? "text-green500" : "text-textDisabled",
              )}
            >
              <SignalIndicator className="w-4 h-4" active={isActive} />
              {isActive ? "Active" : "Inactive"}
            </div>
          </LoadableContent>
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
  const { activeSalary, passiveSalary } = params;

  const { decimals, symbol } = useSalaryAsset();

  const salaryTable = isActive ? activeSalary : passiveSalary;
  const salary = getRankSalary(salaryTable, rank);

  const tooltipContent = useMemo(() => {
    if (isActive) {
      return (
        <>
          It&apos;s the active salary. Passive salary is{" "}
          <ValueDisplay
            showTooltip={false}
            value={toPrecision(
              getRankSalary(passiveSalary || [], rank),
              decimals,
            )}
            symbol={symbol}
          />{" "}
          when inactive.
        </>
      );
    }
    return (
      <>
        It&apos;s the inactive salary. Active salary is{" "}
        <ValueDisplay
          showTooltip={false}
          value={toPrecision(getRankSalary(activeSalary || [], rank), decimals)}
          symbol={symbol}
        />{" "}
        when active.
      </>
    );
  }, [activeSalary, rank, decimals, passiveSalary, isActive, symbol]);

  return (
    <SummaryItem
      title={
        <span className="flex items-center gap-x-1">
          Salary
          <Tooltip content={tooltipContent}></Tooltip>
        </span>
      }
    >
      <div className="flex flex-col">
        <LoadableContent isLoading={loading}>
          <ValueDisplay value={toPrecision(salary, decimals)} symbol={symbol} />
        </LoadableContent>
        <LastPayment />
      </div>
    </SummaryItem>
  );
}
