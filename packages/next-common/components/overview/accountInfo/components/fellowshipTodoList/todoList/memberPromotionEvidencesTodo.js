import pluralize from "pluralize";
import {
  useFilterEvidenceByWish,
  useTodoEvidences,
} from "next-common/components/fellowship/core/memberWarnings";
import { TodoContent, TodoTag, TodoWrapper } from "./styled";
import { useNonCandidateCoreMembers } from "../context/hooks/coreMembers";
import { useHasMemberPromotionEvidencesTodo } from "../hooks/useHasTodo";

export default function MemberPromotionEvidencesTodo() {
  const { members } = useNonCandidateCoreMembers();
  const { all: allEvidences } = useTodoEvidences(members);
  const allPromotionEvidences = useFilterEvidenceByWish(
    allEvidences,
    "Promotion",
  );

  const hasTodo = useHasMemberPromotionEvidencesTodo();
  if (!hasTodo) {
    return null;
  }

  const total = allPromotionEvidences?.length;

  return (
    <TodoWrapper>
      <TodoTag>Membership</TodoTag>
      <TodoContent>
        {total} {pluralize("member", total)} wish for promotion.
      </TodoContent>
    </TodoWrapper>
  );
}
