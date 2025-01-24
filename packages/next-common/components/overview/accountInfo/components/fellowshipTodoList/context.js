import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getMemberData } from "../../hook/useMemberData";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useSelector } from "react-redux";
import { getDemotionPeriodProgress } from "next-common/components/collectives/core/member/demotionPeriod";
import { checkDemotionPeriodExpiration } from "../collectivesDemotionPrompt";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";
import useRelatedReferenda from "next-common/hooks/fellowship/useRelatedReferenda";
import { partition } from "lodash-es";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";
import { getDemotionExpiredCount } from "next-common/components/fellowship/core/memberWarnings";
import { useContextApi } from "next-common/context/api";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import useCoreFellowshipParams from "next-common/hooks/fellowship/core/useFellowshipCoreMember";

const FellowshipToDoListContext = createContext();

function useMyDemotionTodo() {
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

function useDemotedBumpAllTodo() {
  const { members: coreMembers, loading: isLoading } =
    useFellowshipCoreMembers();
  const latestHeight = useSelector(chainOrScanHeightSelector);
  const { params, isLoading: isParamsLoading } = useCoreFellowshipParams();

  const [members] = useMemo(
    () => partition(coreMembers, (m) => m.rank > 0),
    [coreMembers],
  );

  if (isParamsLoading) {
    return { todo: { showDemotedBumpAllTodo: false }, isLoading: true };
  }

  const expiredMembersCount = getDemotionExpiredCount({
    members,
    latestHeight,
    params,
  });

  return {
    todo: {
      showDemotedBumpAllTodo: expiredMembersCount > 0,
    },
    expiredMembersCount,
    isLoading,
  };
}

function FellowshipToDoListProvider({ children }) {
  const {
    todo: { showEvidenceSubmissionTodo, showApproveReferendaCreationTodo },
    isLoading: isMyDemotionTodoLoading,
    myRank,
  } = useMyDemotionTodo();
  const {
    todo: { showDemotedBumpAllTodo },
    isLoading: isDemotedBumpAllLoading,
    expiredMembersCount,
  } = useDemotedBumpAllTodo();

  const data = useMemo(
    () => ({
      todo: {
        showEvidenceSubmissionTodo,
        showApproveReferendaCreationTodo,
        showDemotedBumpAllTodo,
      },
      myRank,
      expiredMembersCount,
      isLoading: isMyDemotionTodoLoading || isDemotedBumpAllLoading,
    }),
    [
      showEvidenceSubmissionTodo,
      showApproveReferendaCreationTodo,
      showDemotedBumpAllTodo,
      expiredMembersCount,
      isMyDemotionTodoLoading,
      isDemotedBumpAllLoading,
      myRank,
    ],
  );

  return (
    <FellowshipToDoListContext.Provider value={data}>
      {children}
    </FellowshipToDoListContext.Provider>
  );
}

function useFellowshipTodoListData() {
  return useContext(FellowshipToDoListContext);
}

export {
  FellowshipToDoListContext,
  FellowshipToDoListProvider,
  useFellowshipTodoListData,
};
