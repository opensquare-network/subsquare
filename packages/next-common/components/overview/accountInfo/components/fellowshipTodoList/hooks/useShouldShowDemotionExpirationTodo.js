import { useContextDemotionExpirationCount } from "../context/demotionExpirationCount";

export function useShouldShowDemotionExpirationTodo() {
  const { expiredMembersCount } = useContextDemotionExpirationCount();
  return expiredMembersCount > 0;
}
