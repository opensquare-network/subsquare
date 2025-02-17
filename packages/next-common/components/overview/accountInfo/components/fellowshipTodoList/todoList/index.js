import RetentionEvidenceSubmissionTodo from "./retentionEvidenceSubmissionTodo";
import DemotionExpirationTodo from "./demotionExpirationTodo";
import useTodoListCount from "../hooks/useTodoListCount";
import MembershipReferendaTodoForLowerRank from "./membershipReferendaTodoForLowerRank";
import {
  useContextMyMemberData,
  useContextMyRank,
} from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/myMemberData";
import useTodoListLoading from "next-common/components/overview/accountInfo/components/fellowshipTodoList/hooks/useTodoListLoading";

function MakeSureLoaded({ children }) {
  const isLoading = useTodoListLoading();
  if (isLoading) {
    return null;
  }

  return children;
}

function HasTodo({ children }) {
  const count = useTodoListCount();
  if (count === 0) {
    return null;
  }

  return <div className="flex flex-col mt-[16px] gap-[4px]">{children}</div>;
}

function OnlyLowRankMembers({ children }) {
  const myRank = useContextMyRank();
  // todo: ambassador may have a different rank threshold
  if (myRank < 3) {
    return null;
  }

  return children;
}

function OnlyMembers({ children }) {
  const { memberData } = useContextMyMemberData();
  const { collectiveMember } = memberData || {};
  if (!collectiveMember) {
    return null;
  }

  return children;
}

export default function TodoList() {
  return (
    <MakeSureLoaded>
      <HasTodo>
        <OnlyMembers>
          <RetentionEvidenceSubmissionTodo />
        </OnlyMembers>
        <DemotionExpirationTodo />
        <OnlyLowRankMembers>
          <MembershipReferendaTodoForLowerRank />
        </OnlyLowRankMembers>
      </HasTodo>
    </MakeSureLoaded>
  );
}
