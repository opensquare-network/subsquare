import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setProfilePreimageDeposits } from "next-common/store/reducers/profile/deposits/preimage";
import queryAddressPreimageDeposits from "next-common/hooks/account/deposit/fetch/preimage";
import useApi from "next-common/utils/hooks/useApi";
import { preImagesTriggerSelector } from "next-common/store/reducers/preImagesSlice";

export default function useFetchProfilePreimageDeposits() {
  const address = useProfileAddress();
  const dispatch = useDispatch();
  const api = useApi();
  const trigger = useSelector(preImagesTriggerSelector);

  useEffect(() => {
    if (!api || !address || !api.query?.preimage) {
      return;
    }

    queryAddressPreimageDeposits(api, address).then((deposits) => {
      dispatch(setProfilePreimageDeposits(deposits.slice(0, 10)));
    });

    return () => {
      dispatch(setProfilePreimageDeposits(null));
    };
  }, [api, address, dispatch, trigger]);
}
