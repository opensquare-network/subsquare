import { MenuHorn } from "@osn/icons/subsquare";
import { isNil } from "lodash-es";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import useEvidencesCombineReferenda from "next-common/hooks/useEvidencesCombineReferenda";
import useAllMemberData from "./useAllMemberData";
import { useMemo } from "react";
import { calculateDemotionPeriod } from "next-common/components/collectives/core/member/demotionPeriod";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import BigNumber from "bignumber.js";

function useCountOfMemberState() {
  const { data: memberData, isLoading } = useAllMemberData();

  const latestHeight = useSelector(chainOrScanHeightSelector);
  const blockTime = useSelector(blockTimeSelector);

  const countOfMembersAboutToDemotionExpire = useMemo(() => {
    if (isLoading) {
      return 0;
    }

    const { data, coreParams } = memberData;

    let countOfMembersAboutToDemotionExpire = 0;

    for (const address in data) {
      const { rank, lastProof } = data[address];
      if (isNil(rank) || isNil(lastProof)) {
        continue;
      }

      const { remainingBlocks, demotionPeriod } = calculateDemotionPeriod({
        latestHeight,
        rank,
        lastProof,
        params: coreParams,
      });

      const daysRemaining = new BigNumber(blockTime)
        .multipliedBy(remainingBlocks)
        .div(86400 * 1000)
        .toNumber();

      if (demotionPeriod > 0 && daysRemaining < 28) {
        countOfMembersAboutToDemotionExpire++;
      }
    }

    return countOfMembersAboutToDemotionExpire;
  }, [memberData, isLoading, latestHeight, blockTime]);

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
  } = useCountOfMemberState();

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
                The demotion period for {countOfMembersAboutToDemotionExpire}{" "}
                members is approaching.
              </li>
            )}
          </ul>
        </div>
      </div>
    </SecondaryCard>
  );
}
