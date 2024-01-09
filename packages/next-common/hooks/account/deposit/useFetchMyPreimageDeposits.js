import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useCombinedPreimageHashes } from "next-common/hooks/usePreimageHashes";
import { setMyPreimageStatuses } from "next-common/store/reducers/myOnChainData/deposits/myPreimageDeposits";

export default function useFetchMyPreimageDeposits() {
  const realAddress = useRealAddress();
  const dispatch = useDispatch();
  const preimageStatuses = useCombinedPreimageHashes();

  useEffect(() => {
    if (preimageStatuses?.length) {
      const myPreimageStatuses = (preimageStatuses || []).filter(
        ({ data: preimageStatus }) => {
          const [, status] = preimageStatus;
          const statusValue = status.unrequested || status.requested;
          const [depositor] = statusValue.ticket || statusValue.deposit || [];
          return depositor === realAddress;
        },
      );

      dispatch(setMyPreimageStatuses(myPreimageStatuses));
    } else {
      dispatch(setMyPreimageStatuses([]));
    }
  }, [realAddress, preimageStatuses, dispatch]);
}
