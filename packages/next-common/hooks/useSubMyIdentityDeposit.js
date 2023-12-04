import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setIdentityDeposit,
  setSubsCount,
  setSubsDeposits,
} from "next-common/store/reducers/myOnChainData/deposits/myIdentityDeposits";
import useApi from "next-common/utils/hooks/useApi";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function useSubMyIdentityDeposit() {
  const dispatch = useDispatch();
  const api = useApi();
  const address = useRealAddress();

  useEffect(() => {
    if (!api) {
      return;
    }

    if (!address) {
      return;
    }

    let unsubIdentityOf;
    api.query.identity
      ?.identityOf(address, (identity) => {
        if (!identity || identity.isNone) {
          dispatch(setIdentityDeposit(0n));
          return;
        }
        const identityDeposit = identity.value.deposit?.toBigInt() || 0n;
        dispatch(setIdentityDeposit(identityDeposit));
      })
      .then((result) => (unsubIdentityOf = result));

    let unsubSubsOf;
    api.query.identity
      ?.subsOf(address, (subs) => {
        if (!subs) {
          dispatch(setSubsDeposits(0n));
          dispatch(setSubsCount(0));
          return;
        }
        const subsDeposit = subs[0]?.toBigInt() || 0n;
        dispatch(setSubsDeposits(subsDeposit));
        const subsCount = subs[1]?.length || 0;
        dispatch(setSubsCount(subsCount));
      })
      .then((result) => (unsubSubsOf = result));

    return () => {
      if (unsubIdentityOf) {
        unsubIdentityOf();
      }
      if (unsubSubsOf) {
        unsubSubsOf();
      }
    };
  }, [dispatch, api, address]);
}
