import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import usePreimageHashs from "next-common/hooks/usePreimageHashs";
import { setMyPreimageStatuses } from "next-common/store/reducers/myOnChainData/deposits/myPreimageDeposits";

export default function useFetchMyPreimageDeposits() {
  const realAddress = useRealAddress();
  const dispatch = useDispatch();
  const preimageStatuses = usePreimageHashs();

  useEffect(() => {
    if (preimageStatuses?.length) {
      const myPreimageStatuses = (preimageStatuses || []).filter(
        (preimageStatus) => {
          const [, status] = preimageStatus;
          const statusValue = status.unrequested || status.requested;
          const [depositor] = statusValue.deposit || [];
          return depositor === realAddress;
        },
      );

      dispatch(setMyPreimageStatuses(myPreimageStatuses));
    } else {
      dispatch(setMyPreimageStatuses([]));
    }
  }, [realAddress, preimageStatuses]);
}
