import useSubStorage from "next-common/hooks/common/useSubStorage";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";

export function useFellowshipMember(address, pallet = "fellowshipCollective") {
  const api = useConditionalContextApi();
  const { result: member, loading: isLoading } = useSubStorage(
    pallet,
    "members",
    [address],
    {
      api,
    },
  );
  return {
    member,
    isLoading,
  };
}
