import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setProfilePreimageDeposits } from "next-common/store/reducers/profile/deposits/preimage";
import queryAddressPreimageDeposits from "next-common/hooks/account/deposit/fetch/preimage";
import queryAddressPreimageDepositsPapi from "next-common/hooks/account/deposit/fetch/preimage/papi";
import { preImagesTriggerSelector } from "next-common/store/reducers/preImagesSlice";
import { useContextApi } from "next-common/context/api";
import { useContextPapi } from "next-common/context/papi";
import { useChainSettings } from "next-common/context/chain";

export default function useFetchProfilePreimageDeposits() {
  const address = useProfileAddress();
  const dispatch = useDispatch();
  const api = useContextApi();
  const { api: papi, checkPallet } = useContextPapi();
  const { enablePapi } = useChainSettings();
  const trigger = useSelector(preImagesTriggerSelector);

  useEffect(() => {
    if (!address) {
      return;
    }
    if (enablePapi && !checkPallet("Preimage")) {
      return;
    }
    if (!enablePapi && !api?.query?.preimage) {
      return;
    }

    const promise = enablePapi
      ? queryAddressPreimageDepositsPapi(papi, address)
      : queryAddressPreimageDeposits(api, address);

    promise.then((deposits) => {
      dispatch(setProfilePreimageDeposits(deposits.slice(0, 10)));
    });

    return () => {
      dispatch(setProfilePreimageDeposits(null));
    };
  }, [api, papi, checkPallet, enablePapi, address, dispatch, trigger]);
}
