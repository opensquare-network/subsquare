import useConditionalSubStorage from "next-common/hooks/common/useConditionalSubStorage";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";

export function useFellowshipMember(address, pallet = "fellowshipCollective") {
  const api = useConditionalContextApi();
  const { result: member, loading: isLoading } = useConditionalSubStorage(
    pallet,
    "members",
    [address],
    { api },
  );
  return {
    member,
    isLoading,
  };
}
