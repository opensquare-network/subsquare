import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setMyPreimageDeposits } from "next-common/store/reducers/myOnChainData/deposits/myPreimageDeposits";
import useApi from "next-common/utils/hooks/useApi";
import queryAddressPreimageDeposits from "next-common/hooks/account/deposit/fetch/preimage";
import { preImagesTriggerSelector } from "next-common/store/reducers/preImagesSlice";

export default function useFetchMyPreimageDeposits() {
  const realAddress = useRealAddress();
  const dispatch = useDispatch();
  const api = useApi();
  const trigger = useSelector(preImagesTriggerSelector);

  useEffect(() => {
    if (!api || !realAddress || !api.query?.preimage) {
      return;
    }

    queryAddressPreimageDeposits(api, realAddress).then((deposits) => {
      dispatch(setMyPreimageDeposits(deposits));
    });
  }, [api, realAddress, dispatch, trigger]);
}
