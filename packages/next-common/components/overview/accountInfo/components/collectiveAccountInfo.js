import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import FieldLoading from "next-common/components/icons/fieldLoading";
import { FELLOWSHIP_RANK_LEVEL_NAMES } from "next-common/utils/constants";
import FellowshipRank from "next-common/components/fellowship/rank";
import DemotionRemainLabel from "next-common/components/profile/fellowship/demotionRemainLabel";
import PromotionRemainLabel from "next-common/components/profile/fellowship/promotionRemainLabel";
import {
  useAmbassadorMemberData,
  useFellowshipMemberData,
} from "../context/memberDataContext";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import { isNil } from "lodash-es";
import AccountBalances from "./accountBalances";

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
      <div className="flex items-center gap-[8px] ">
        <FellowshipRank rank={collectiveMember?.rank} />
        {FELLOWSHIP_RANK_LEVEL_NAMES[collectiveMember?.rank]}
      </div>
      <div className="flex flex-col gap-[4px]">
        <DemotionRemainLabel
          lastProof={coreMember?.lastProof}
          rank={collectiveMember?.rank}
          params={coreParams}
        />
        <PromotionRemainLabel
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

function CollectivesAccountInfoMobile() {
  return (
    <>
      <AccountBalances />
      <SummaryLayout>
        <FellowshipMember />
        <AmbassadorMember />
      </SummaryLayout>
    </>
  );
}

function CollectivesAccountInfoDesktop() {
  return (
    <SummaryLayout>
      <AccountBalances />
      <div></div>
      <FellowshipMember />
      <AmbassadorMember />
    </SummaryLayout>
  );
}

export default function CollectivesAccountInfo() {
  const { width } = useWindowSize();

  if (isNil(width)) {
    return null;
  }

  return width > 768 ? (
    <CollectivesAccountInfoDesktop />
  ) : (
    <CollectivesAccountInfoMobile />
  );
}
