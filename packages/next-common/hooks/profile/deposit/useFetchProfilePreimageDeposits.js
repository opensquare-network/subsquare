import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { useDispatch } from "react-redux";
import { useCombinedPreimageHashes } from "next-common/hooks/usePreimageHashes";
import { useEffect } from "react";
import { setProfilePreimageStatuses } from "next-common/store/reducers/profile/deposits/preimage";
import { isSameAddress } from "next-common/utils";

export default function useFetchProfilePreimageDeposits() {
  const address = useProfileAddress();
  const dispatch = useDispatch();
  const preimageStatuses = useCombinedPreimageHashes();

  useEffect(() => {
    const myPreimageStatuses = (preimageStatuses || []).filter(
      ({ data: preimageStatus }) => {
        const [, status] = preimageStatus;
        const statusValue = status.unrequested || status.requested;
        const [depositor] = statusValue.ticket || statusValue.deposit || [];
        return isSameAddress(depositor, address);
      },
    );

    dispatch(setProfilePreimageStatuses(myPreimageStatuses));

    return () => {
      dispatch(setProfilePreimageStatuses(null));
    };
  }, [address, preimageStatuses, dispatch]);
}
