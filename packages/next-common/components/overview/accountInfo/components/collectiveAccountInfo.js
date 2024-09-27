import { TotalBalance, Transferrable } from "./accountBalances";
import FieldLoading from "next-common/components/icons/fieldLoading";
import { FELLOWSHIP_RANK_LEVEL_NAMES } from "next-common/utils/constants";
import FellowshipRank from "next-common/components/fellowship/rank";
import DemotionRemainLabel from "next-common/components/profile/fellowship/demotionRemainLabel";
import PromotionRemainLabel from "next-common/components/profile/fellowship/promotionRemainLabel";
import {
  useAmbassadorMemberData,
  useFellowshipMemberData,
} from "../context/memberDataContext";
import CollapsePanel from "./collapsePanel";

function CollectivesAccountInfoItem({ title, children }) {
  return (
    <div className="w-full flex grow justify-between">
      <span className="text14Medium text-textTertiary">{title}</span>
      {children}
    </div>
  );
}

function MemberInfo({ data, isLoading }) {
  if (isLoading) {
    return <FieldLoading />;
  }

  const { collectiveMember, coreMember, coreParams } = data;

  if (!collectiveMember || !coreMember || !coreParams) {
    return <span className="text-textTertiary text14Medium">-</span>;
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
    <CollectivesAccountInfoItem title="Fellowship">
      <MemberInfo data={data} isLoading={isLoading} />
    </CollectivesAccountInfoItem>
  );
}

function AmbassadorMember() {
  const { data, isLoading } = useAmbassadorMemberData();
  return (
    <CollectivesAccountInfoItem title="Ambassador">
      <MemberInfo data={data} isLoading={isLoading} />
    </CollectivesAccountInfoItem>
  );
}

export default function CollectivesAccountInfo() {
  return (
    <CollapsePanel labelItem={<TotalBalance />}>
      <Transferrable />
      <FellowshipMember />
      <AmbassadorMember />
    </CollapsePanel>
  );
}
