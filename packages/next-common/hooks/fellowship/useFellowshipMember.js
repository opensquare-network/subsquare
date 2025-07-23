import useSubStorage from "next-common/hooks/common/useSubStorage";

export function useFellowshipMember(address, pallet = "fellowshipCollective") {
  const { result: member, loading: isLoading } = useSubStorage(
    pallet,
    "members",
    [address],
  );
  return {
    member,
    isLoading,
  };
}
