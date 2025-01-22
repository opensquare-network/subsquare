import { useCollectivesApi } from "next-common/context/collectives/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { createContext, useContext, useEffect, useState } from "react";
import { getMemberData } from "../../hook/useMemberData";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useSelector } from "react-redux";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { getDemotionPeriodProgress } from "next-common/components/collectives/core/member/demotionPeriod";
import { checkDemotionPeriodExpiration } from "../collectivesDemotionPrompt";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";
import useRelatedReferenda from "next-common/hooks/fellowship/useRelatedReferenda";

const FellowshipToDoListContext = createContext();

function FellowshipToDoListProvider({ children }) {
  const api = useCollectivesApi();
  const corePallet = useCoreFellowshipPallet();
  const address = useRealAddress();
  const [isLoading, setIsLoading] = useState(true);
  const blockTime = useSelector(blockTimeSelector);
  const latestHeight = useSelector(chainOrScanHeightSelector);
  const {
    relatedReferenda: relatedApproveReferenda,
    isLoading: isRelatedApprovedReferendaLoading,
  } = useRelatedReferenda(address, ["approve"]);

  const [showEvidenceSubmissionInfo, setShowEvidenceSubmissionInfo] =
    useState(false);
  const [
    showApproveReferendaCreationInfo,
    setShowApproveReferendaCreationInfo,
  ] = useState(false);

  useEffect(() => {
    if (!api || !address) {
      return;
    }

    setIsLoading(true);
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
        setShowEvidenceSubmissionInfo(true);
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
        setShowApproveReferendaCreationInfo(true);
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

  return (
    <FellowshipToDoListContext.Provider
      value={{
        todo: {
          showEvidenceSubmissionInfo,
          showApproveReferendaCreationInfo,
        },
        isLoading,
      }}
    >
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
