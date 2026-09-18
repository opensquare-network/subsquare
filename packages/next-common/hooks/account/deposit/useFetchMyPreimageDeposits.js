import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setMyPreimageDeposits } from "next-common/store/reducers/myOnChainData/deposits/myPreimageDeposits";
import queryAddressPreimageDeposits from "next-common/hooks/account/deposit/fetch/preimage";
import queryAddressPreimageDepositsPapi from "next-common/hooks/account/deposit/fetch/preimage/papi";
import { preImagesTriggerSelector } from "next-common/store/reducers/preImagesSlice";
import { useContextApi } from "next-common/context/api";
import { useContextPapi } from "next-common/context/papi";
import { useChainSettings } from "next-common/context/chain";

export default function useFetchMyPreimageDeposits() {
  const realAddress = useRealAddress();
  const dispatch = useDispatch();
  const api = useContextApi();
  const { api: papi, checkPallet } = useContextPapi();
  const { enablePapi } = useChainSettings();
  const trigger = useSelector(preImagesTriggerSelector);

  useEffect(() => {
    if (!realAddress) {
      return;
    }
    if (enablePapi && !checkPallet("Preimage")) {
      return;
    }
    if (!enablePapi && !api?.query?.preimage) {
      return;
    }

    const promise = enablePapi
      ? queryAddressPreimageDepositsPapi(papi, realAddress)
      : queryAddressPreimageDeposits(api, realAddress);

    promise.then((deposits) => {
      dispatch(setMyPreimageDeposits(deposits));
    });
  }, [api, papi, checkPallet, enablePapi, realAddress, dispatch, trigger]);
}
