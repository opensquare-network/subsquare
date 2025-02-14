import { useContextDemotionExpirationCount } from "../context/demotionExpirationCount";

export default function useMyDemotionExpirationTodoLoading() {
  const { isLoading } = useContextDemotionExpirationCount();
  return isLoading;
}
