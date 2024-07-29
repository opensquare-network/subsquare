import { MenuHorn } from "@osn/icons/subsquare";
import { isNil } from "lodash-es";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import useEvidencesCombineReferenda from "next-common/hooks/useEvidencesCombineReferenda";
import { useMemo } from "react";
import { calculateDemotionPeriod } from "next-common/components/collectives/core/member/demotionPeriod";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import BigNumber from "bignumber.js";
import useCoreMembersWithRank from "next-common/components/collectives/core/useCoreMembersWithRank";
import { useCoreFellowshipParams } from "next-common/context/collectives/collectives";
import { ONE_DAY } from "next-common/utils/constants";

const days20 = 20 * ONE_DAY;

function useCountOfMembersAboutToDemotionExpire() {
  const { members: coreMembers, isLoading } = useCoreMembersWithRank();
  const params = useCoreFellowshipParams();

  const latestHeight = useSelector(chainOrScanHeightSelector);
  const blockTime = useSelector(blockTimeSelector);

  const countOfMembersAboutToDemotionExpire = useMemo(() => {
    return coreMembers.filter(coreMember => {
      const { status: { lastProof }, rank } = coreMember;
      if (rank <= 0) { // this warning is for members page, so we should filter out candidates
        return false;
      }

      const { remainingBlocks, demotionPeriod } = calculateDemotionPeriod({
        latestHeight,
        rank,
        lastProof,
        params,
      });

      return demotionPeriod > 0 &&
        new BigNumber(blockTime).multipliedBy(remainingBlocks).lte(days20) // less than 20 days
    }).length;
  }, [coreMembers, isLoading, latestHeight, blockTime, params]);

  return {
    countOfMembersAboutToDemotionExpire,
    isLoading,
  };
}

function useEvidencesStat() {
  const { evidences, isLoading } = useEvidencesCombineReferenda();
  const totalEvidences = (evidences || []).length || 0;

  const evidencesToBeHandled = (evidences || []).filter((evidence) =>
    isNil(evidence.referendumIndex),
  ).length;

  return {
    totalEvidences,
    evidencesToBeHandled,
    isLoading,
  };
}

export default function MemberStatInfo({ className }) {
  const {
    countOfMembersAboutToDemotionExpire,
    isLoading: isAboutToDemotionExpireLoading,
  } = useCountOfMembersAboutToDemotionExpire();

  const {
    totalEvidences,
    evidencesToBeHandled,
    isLoading: isEvidenceLoading,
  } = useEvidencesStat();

  if (
    isEvidenceLoading ||
    isAboutToDemotionExpireLoading ||
    (totalEvidences <= 0 && countOfMembersAboutToDemotionExpire <= 0)
  ) {
    return null;
  }

  return (
    <SecondaryCard className={className}>
      <div className="flex gap-[16px]">
        <div>
          <div className="bg-theme100 rounded-[8px] p-[8px]">
            <MenuHorn
              className="[&_path]:fill-theme500"
              width={24}
              height={24}
            />
          </div>
        </div>
        <div className="text-textPrimary text14Medium">
          <ul className="list-disc list-inside">
            {totalEvidences > 0 && (
              <li className="pl-[1em]">
                {evidencesToBeHandled} evidences to be handled in total{" "}
                {totalEvidences} evidences.
              </li>
            )}
            {countOfMembersAboutToDemotionExpire > 0 && (
              <li className="pl-[1em]">
                {countOfMembersAboutToDemotionExpire} members' demotion period is about to reached in under 20 days.
              </li>
            )}
          </ul>
        </div>
      </div>
    </SecondaryCard>
  );
}
