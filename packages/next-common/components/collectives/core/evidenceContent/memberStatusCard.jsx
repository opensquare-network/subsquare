import { ArrowExternalLink } from "@osn/icons/subsquare";
import FellowshipRank from "next-common/components/fellowship/rank";
import Tooltip from "next-common/components/tooltip";
import { AddressUser } from "next-common/components/user";
import { cn } from "next-common/utils";
import Link from "next/link";
import CoreFellowshipMemberDemotionPeriod from "../member/demotionPeriod";
import CoreFellowshipMemberPromotionPeriod from "../member/promotionPeriod";

export default function FellowshipEvidenceMemberStatusCard({
  member,
  isLoading,
  params,
}) {
  if (isLoading || !member) {
    return null;
  }

  const {
    rank,
    address,
    status: { lastProof, lastPromotion } = {},
  } = member || {};

  return (
    <div
      className={cn(
        "flex items-center gap-4",
        "max-sm:flex-col max-sm:items-start",
        "w-full",
        "p-4",
        "border border-neutral300 rounded-lg",
      )}
    >
      <div className="flex items-center gap-x-2 grow">
        <AddressUser add={address} />
        <FellowshipRank rank={rank} />
      </div>

      <div className="flex items-center gap-x-4 max-sm:w-full">
        <CoreFellowshipMemberDemotionPeriod
          className="basis-auto"
          lastProof={lastProof}
          rank={rank}
          params={params}
        />
        {rank > 0 && (
          <CoreFellowshipMemberPromotionPeriod
            className="basis-auto"
            lastPromotion={lastPromotion}
            rank={rank}
            params={params}
          />
        )}
      </div>

      <div className="flex items-center max-sm:w-full">
        <Tooltip content="All Core Members" className="max-sm:hidden">
          <Link
            href="/fellowship/core"
            className="text-textTertiary hover:text-textSecondary"
          >
            <ArrowExternalLink className="w-5 h-5" />
          </Link>
        </Tooltip>

        <Link
          href="/fellowship/core"
          className="sm:hidden w-full text-right text-theme500 text14Medium"
        >
          All Core Members
        </Link>
      </div>
    </div>
  );
}
