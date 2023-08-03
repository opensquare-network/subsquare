import useAccountDemocracyVotes from "next-common/hooks/democracy/votes/useAccountDemocracyVotes";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import CommonVotes from "./commonVotes";

export default function MyDemocracyVotes({
  moduleTabIndex,
  setModuleTabIndex,
}) {
  const realAddress = useRealAddress();

  const { isLoading, votes } = useAccountDemocracyVotes(realAddress);

  return (
    <CommonVotes
      moduleTabIndex={moduleTabIndex}
      setModuleTabIndex={setModuleTabIndex}
      votes={votes}
      isLoading={isLoading}
    />
  );
}
