import useMyDemotionExpirationTodoLoading from "../hooks/useMyDemotionExpirationTodoLoading";
import useMyDemotionTodoLoading from "../hooks/useMyDemotionTodoLoading";

export default function useTodoListLoading() {
  const isMyDemotionTodoLoading = useMyDemotionTodoLoading();
  const isMyDemotionExpirationTodoLoading =
    useMyDemotionExpirationTodoLoading();
  return isMyDemotionTodoLoading || isMyDemotionExpirationTodoLoading;
}
