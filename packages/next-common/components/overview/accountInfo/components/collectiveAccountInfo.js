import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
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

function MemberInfo({ data }) {
  const { collectiveMember, coreMember, coreParams } = data;

  return (
    <div className="flex flex-col gap-1">
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

  if (isLoading) {
    return null;
  }

  const { collectiveMember, coreMember, coreParams } = data;

  if (!collectiveMember || !coreMember || !coreParams) {
    return null;
  }

  return (
    <SummaryItem title="Fellowship">
      <MemberInfo data={data} />
    </SummaryItem>
  );
}

function AmbassadorMember() {
  const { data, isLoading } = useAmbassadorMemberData();

  if (isLoading) {
    return null;
  }

  const { collectiveMember, coreMember, coreParams } = data;

  if (!collectiveMember || !coreMember || !coreParams) {
    return null;
  }

  return (
    <SummaryItem title="Ambassador">
      <MemberInfo data={data} />
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
      <div className="col-span-2">
        <AccountBalances />
      </div>
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
