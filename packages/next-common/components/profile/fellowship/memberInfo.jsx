import { find } from "lodash-es";
import LoadableContent from "next-common/components/common/loadableContent";
import FellowshipRank from "next-common/components/fellowship/rank";
import SignalIndicator from "next-common/components/icons/signalIndicator";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import ValueDisplay from "next-common/components/valueDisplay";
import { usePageProps } from "next-common/context/page";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import nextApi from "next-common/services/nextApi";
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
  const { members } = useFellowshipCoreMembers();
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
  const { members } = useFellowshipCoreMembers();
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
    const resp = await nextApi.fetch(paramsApi);
    if (resp.result) {
      return resp.result;
    }
  });

  const { activeSalary = [], passiveSalary = [] } = params;

  const { rank, status } = member;
  const { lastProof, lastPromotion, isActive } = status || {};

  const { decimals, symbol } = getSalaryAsset();

  return (
    <NeutralPanel className="p-6">
      <SummaryLayout>
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

        <SummaryItem title="Active Salary">
          <LoadableContent isLoading={loading}>
            <ValueDisplay
              value={toPrecision(getRankSalary(activeSalary, rank), decimals)}
              symbol={symbol}
            />
          </LoadableContent>
        </SummaryItem>

        <SummaryItem title="Passive Salary">
          <LoadableContent isLoading={loading}>
            <ValueDisplay
              value={toPrecision(getRankSalary(passiveSalary, rank), decimals)}
              symbol={symbol}
            />
          </LoadableContent>
        </SummaryItem>
      </SummaryLayout>
    </NeutralPanel>
  );
}
