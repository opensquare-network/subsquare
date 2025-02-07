import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect, useState } from "react";
import { getMemberData } from "../../../hook/useMemberData";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useSelector } from "react-redux";
import { getDemotionPeriodProgress } from "next-common/components/collectives/core/member/demotionPeriod";
import { checkDemotionPeriodExpiration } from "../../collectivesDemotionPrompt";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";
import useRelatedReferenda from "next-common/hooks/fellowship/useRelatedReferenda";
import { useContextApi } from "next-common/context/api";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";

export default function useMyDemotionTodo() {
  const api = useContextApi();
  const corePallet = useCoreFellowshipPallet();
  const address = useRealAddress();
  const [isLoading, setIsLoading] = useState(true);
  const [myRank, setMyRank] = useState(null);
  const blockTime = useSelector(blockTimeSelector);
  const latestHeight = useSelector(chainOrScanHeightSelector);

  const {
    relatedReferenda: relatedApproveReferenda,
    isLoading: isRelatedApprovedReferendaLoading,
  } = useRelatedReferenda(address, ["approve"]);

  const [showEvidenceSubmissionTodo, setShowEvidenceSubmissionTodo] =
    useState(false);
  const [
    showApproveReferendaCreationTodo,
    setShowApproveReferendaCreationTodo,
  ] = useState(false);

  useEffect(() => {
    if (!api || !address) {
      return;
    }

    (async () => {
      const memberData = await getMemberData({
        section: "fellowship",
        api,
        address,
      });
      const { collectiveMember, coreMember, coreParams } = memberData;

      const lastProof = coreMember?.lastProof;
      const rank = collectiveMember?.rank;
      const params = coreParams;

      setMyRank(rank);

      const { percentageValue, remainingBlocks, demotionPeriod } =
        getDemotionPeriodProgress({ rank, params, lastProof, latestHeight });

      const { isDemotionExpiring } = checkDemotionPeriodExpiration({
        percentageValue,
        blockTime,
        remainingBlocks,
        demotionPeriod,
      });

      if (!isDemotionExpiring) {
        return;
      }

      const evidence = await api.query[corePallet]?.memberEvidence(address);
      const data = evidence?.toJSON();
      if (!data) {
        setShowEvidenceSubmissionTodo(true);
        return;
      }

      const [wish] = data;

      if (wish?.toLowerCase() === "retention" && evidence) {
        if (isRelatedApprovedReferendaLoading) {
          return;
        }
        if (relatedApproveReferenda?.length > 0) {
          return;
        }
        // Should show RetentionReferendaCreationTodo
        setShowApproveReferendaCreationTodo(true);
      }
    })().then(() => {
      setIsLoading(false);
    });
  }, [
    api,
    address,
    blockTime,
    latestHeight,
    corePallet,
    isRelatedApprovedReferendaLoading,
    relatedApproveReferenda,
  ]);

  return {
    todo: {
      showEvidenceSubmissionTodo,
      showApproveReferendaCreationTodo,
    },
    myRank,
    isLoading,
  };
}
