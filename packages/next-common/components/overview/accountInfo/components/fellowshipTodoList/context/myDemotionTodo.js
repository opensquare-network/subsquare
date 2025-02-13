import { createContext, useContext } from "react";
import { useCollectivesSection } from "next-common/context/collectives/collectives";
import useMemberData from "../../../hook/useMemberData";
import useRelatedReferenda from "next-common/hooks/fellowship/useRelatedReferenda";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useMyDemotionPeriodExpiration from "../hooks/useMyDemotionPeriodExpiration";
import useMyMemberEvidence from "../hooks/useMyMemberEvidence";

export const MyDemotionTodoContext = createContext();

function CheckMyDemotionPeriodExpiration({ children, memberData, ...props }) {
  const { isDemotionExpiring } = useMyDemotionPeriodExpiration(memberData);

  return (
    <MyDemotionTodoContext.Provider
      value={{
        ...props,
        isDemotionExpiring,
      }}
    >
      {children}
    </MyDemotionTodoContext.Provider>
  );
}

export default function MyDemotionTodoProvider({ children }) {
  const address = useRealAddress();
  const section = useCollectivesSection();
  const { data: memberData, isLoading: isMemberDataLoading } =
    useMemberData(section);
  const { evidence, isLoading: isEvidenceLoading } = useMyMemberEvidence();
  const {
    relatedReferenda: relatedApproveReferenda,
    isLoading: isRelatedApprovedReferendaLoading,
  } = useRelatedReferenda(address, ["approve"]);

  const isLoading =
    isMemberDataLoading ||
    isEvidenceLoading ||
    isRelatedApprovedReferendaLoading;

  if (isLoading) {
    return (
      <MyDemotionTodoContext.Provider value={{ isLoading: true }}>
        {children}
      </MyDemotionTodoContext.Provider>
    );
  }

  return (
    <CheckMyDemotionPeriodExpiration
      isLoading={false}
      memberData={memberData}
      evidence={evidence}
      relatedApproveReferenda={relatedApproveReferenda}
      myRank={memberData?.collectiveMember?.rank}
    >
      {children}
    </CheckMyDemotionPeriodExpiration>
  );
}

export function useMyDemotionTodoData() {
  return useContext(MyDemotionTodoContext);
}

export function useShouldShowRetentionReferendaCreationTodo() {
  const { isDemotionExpiring, evidence, relatedApproveReferenda } =
    useMyDemotionTodoData();

  if (!isDemotionExpiring || !evidence) {
    return false;
  }

  const data = evidence.toJSON();
  if (!data) {
    return false;
  }

  const [wish] = data;

  return (
    wish?.toLowerCase() === "retention" && !relatedApproveReferenda?.length
  );
}

export function useShouldShowRetentionEvidenceSubmissionTodo() {
  const { isDemotionExpiring, evidence } = useMyDemotionTodoData();
  return isDemotionExpiring && (!evidence || !evidence.toJSON());
}
