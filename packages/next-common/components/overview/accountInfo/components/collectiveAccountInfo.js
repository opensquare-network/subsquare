import { isNil } from "lodash-es";
import SummaryLayout from "next-common/components/summary/layout/layout";
import { TotalBalance, Transferrable } from "./accountBalances";
import SummaryItem from "next-common/components/summary/layout/item";
import { useDemotionPeriod } from "next-common/components/collectives/core/member/demotionPeriod";
import { useRemainingTime } from "next-common/components/remaining";
import { usePromotionPeriod } from "next-common/components/collectives/core/member/promotionPeriod";
import FieldLoading from "next-common/components/icons/fieldLoading";
import RemainLabel from "next-common/components/fellowship/salary/cycles/summary/remainLabel";
import { getRankColor } from "next-common/utils/fellowship/getRankColor";
import { cn } from "next-common/utils";
import { useAmbassadorMemberData } from "../context/ambassadorMemberDataContext";
import { useFellowshipMemberData } from "../context/fellowshipMemberDataContext";

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

function Rank({ rank }) {
  const textColor = getRankColor(rank);
  const bgColor = getRankColor(rank, 0.15);

  return (
    <div className="flex items-center gap-[8px] ">
      <div
        className={cn(
          "flex items-center justify-center",
          "w-[20px] py-[2px] rounded-[4px] text12Bold",
        )}
        style={{
          backgroundColor: bgColor,
          color: textColor,
        }}
      >
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

  if (isNil(demotionPeriod)) {
    return null;
  }

  let text = "";
  if (demotionPeriod > 0) {
    if (percentageValue !== 100) {
      text = remaining;
    } else {
      text = "Expired";
    }
  }

  return (
    <RemainLabel
      percentage={percentageValue}
      label={rank <= 0 ? "Offboard" : "Demotion"}
      total={demotionPeriod}
      remain={remainingBlocks}
      text={text}
    />
  );
}

function Promotion({ lastPromotion, rank, params }) {
  const { percentageValue, remainingBlocks, promotionPeriod } =
    usePromotionPeriod({ rank, lastPromotion, params });

  const remaining = useRemainingTime(remainingBlocks);

  if (isNil(promotionPeriod)) {
    return null;
  }

  let text = "";
  if (promotionPeriod > 0) {
    if (percentageValue !== 100) {
      text = remaining;
    } else {
      text = "Promotable";
    }
  }

  return (
    <RemainLabel
      percentage={percentageValue}
      label="Promotion"
      total={promotionPeriod}
      remain={remainingBlocks}
      text={text}
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
  const { data, isLoading } = useFellowshipMemberData();
  return (
    <SummaryItem title="Fellowship">
      <MemberInfo data={data} isLoading={isLoading} />
    </SummaryItem>
  );
}

function AmbassadorMember() {
  const { data, isLoading } = useAmbassadorMemberData();
  return (
    <SummaryItem title="Ambassador">
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
