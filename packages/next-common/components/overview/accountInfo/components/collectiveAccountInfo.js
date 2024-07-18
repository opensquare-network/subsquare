import SummaryLayout from "next-common/components/summary/layout/layout";
import { TotalBalance, Transferrable } from "./accountBalances";
import SummaryItem from "next-common/components/summary/layout/item";
import { useContextApi } from "next-common/context/api";
import useSubscribe from "next-common/utils/hooks/useSubscribe";
import { useDemotionPeriod } from "next-common/components/collectives/core/member/demotionPeriod";
import { useRemainingTime } from "next-common/components/remaining";
import { usePromotionPeriod } from "next-common/components/collectives/core/member/promotionPeriod";
import FieldLoading from "next-common/components/icons/fieldLoading";
import RemainLabel from "next-common/components/fellowship/salary/cycles/summary/remainLabel";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

const RankLevelNames = [
  "Candidates",
  "Member",
  "Proficient",
  "Fellow",
  "Architect",
  "Architect Adept",
  "Grand Architect",
  "Free Master",
  "Master Constant",
  "Grand Master",
];

function useMemberData(pallet = "fellowship") {
  let collectivePallet = "fellowshipCollective";
  let corePallet = "fellowshipCore";

  if (pallet === "ambassador") {
    collectivePallet = "ambassadorCollective";
    corePallet = "ambassadorCore";
  }

  const address = useRealAddress();
  const api = useContextApi();

  const { value: collectiveMember, loading: isCollectiveMemberLoading } =
    useSubscribe(api?.query[collectivePallet].members, [address]);

  const { value: coreMember, loading: isCoreMemberLoading } = useSubscribe(
    api?.query[corePallet].member,
    [address],
  );

  const { value: coreParams, loading: isCoreParamsLoading } = useSubscribe(
    api?.query[corePallet].params,
  );

  const isLoading =
    isCollectiveMemberLoading || isCoreMemberLoading || isCoreParamsLoading;

  if (isLoading) {
    return {
      data: null,
      isLoading: true,
    };
  }

  return {
    data: {
      collectiveMember: collectiveMember?.toJSON(),
      coreMember: coreMember?.toJSON(),
      coreParams: coreParams?.toJSON(),
    },
    isLoading,
  };
}

function Rank({ rank }) {
  return (
    <div className="flex items-center gap-[8px] ">
      <div className="w-[20px] py-[2px] bg-[#B276EA26] rounded-[4px] text-[#B276EA] text12Bold flex items-center justify-center">
        {rank}
      </div>
      <span className="text-textPrimary text16Bold">
        {RankLevelNames[rank]}
      </span>
    </div>
  );
}

function Demotion({ lastProof, rank, params }) {
  const { percentageValue, remainingBlocks, demotionPeriod } =
    useDemotionPeriod({ rank, lastProof, params });

  const remaining = useRemainingTime(remainingBlocks);

  if (!demotionPeriod) {
    return null;
  }

  return (
    <RemainLabel
      percentage={percentageValue}
      label={rank <= 0 ? "Offboard" : "Demotion"}
      remain={remainingBlocks}
      text={remainingBlocks > 0 ? remaining : "Expired"}
    />
  );
}

function Promotion({ lastPromotion, rank, params }) {
  const { percentageValue, remainingBlocks, promotionPeriod } =
    usePromotionPeriod({ rank, lastPromotion, params });

  const remaining = useRemainingTime(remainingBlocks);

  if (!promotionPeriod) {
    return null;
  }

  return (
    <RemainLabel
      percentage={percentageValue}
      label="Promotion"
      remain={remainingBlocks}
      text={remainingBlocks > 0 ? remaining : "Promotable"}
    />
  );
}

function MemberInfo({ data, isLoading }) {
  if (isLoading) {
    return <FieldLoading />;
  }

  const { collectiveMember, coreMember, coreParams } = data;

  if (!collectiveMember || !coreMember || !coreParams) {
    return <span className="text-textTertiary text16Bold">-</span>;
  }

  return (
    <div className="flex flex-col gap-[16px] mt-1">
      <Rank rank={collectiveMember?.rank} />
      <div className="flex flex-col gap-[4px]">
        <Demotion
          lastProof={coreMember?.lastProof}
          rank={collectiveMember?.rank}
          params={coreParams}
        />
        <Promotion
          lastPromotion={coreMember?.lastPromotion}
          rank={collectiveMember?.rank}
          params={coreParams}
        />
      </div>
    </div>
  );
}

function FellowshipMember() {
  const { data, isLoading } = useMemberData("fellowship");
  return (
    <SummaryItem title="Fellowship Member">
      <MemberInfo data={data} isLoading={isLoading} />
    </SummaryItem>
  );
}

function AmbassadorMember() {
  const { data, isLoading } = useMemberData("ambassador");
  return (
    <SummaryItem title="Ambassador Member">
      <MemberInfo data={data} isLoading={isLoading} />
    </SummaryItem>
  );
}

export default function CollectivesAccountInfo() {
  return (
    <SummaryLayout>
      <TotalBalance />
      <Transferrable />
      <FellowshipMember />
      <AmbassadorMember />
    </SummaryLayout>
  );
}
