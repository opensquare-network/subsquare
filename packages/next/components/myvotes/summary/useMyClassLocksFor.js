import useApi from "next-common/utils/hooks/useApi";
import useCall from "next-common/utils/hooks/useCall";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function useMyClassLocksFor() {
  const api = useApi();
  const realAddress = useRealAddress();
  const [classLocks] = useCall(api?.query?.convictionVoting?.classLocksFor, [
    realAddress,
  ]);
  if (classLocks) {
    return classLocks.toJSON().map(([trackId, lock]) => ({ trackId, lock }));
  }

  return classLocks;
}
