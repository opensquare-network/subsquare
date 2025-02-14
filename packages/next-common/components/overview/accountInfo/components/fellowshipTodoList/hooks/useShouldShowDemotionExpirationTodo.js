import { useContextDemotionExpirationCount } from "../context/demotionExpirationCount";

export default function useShouldShowDemotionExpirationTodo() {
  const { expiredMembersCount } = useContextDemotionExpirationCount();
  return expiredMembersCount > 0;
}
