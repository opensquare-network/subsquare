import useAccountVotes from "next-common/hooks/referenda/votes/useAccountVotes";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import CommonVotes from "./commonVotes";

export default function MyOpenGovVotes({ moduleTabIndex, setModuleTabIndex }) {
  const realAddress = useRealAddress();

  const { isLoading, votes } = useAccountVotes(realAddress);

  return (
    <CommonVotes
      moduleTabIndex={moduleTabIndex}
      setModuleTabIndex={setModuleTabIndex}
      votes={votes}
      isLoading={isLoading}
    />
  );
}
