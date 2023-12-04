import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setIdentityDeposit,
  setSubsDeposits,
  setSubs,
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
          dispatch(setIdentityDeposit("0"));
          return;
        }
        const identityDeposit =
          identity.value.deposit?.toBigInt().toString() || "0";
        dispatch(setIdentityDeposit(identityDeposit));
      })
      .then((result) => (unsubIdentityOf = result));

    let unsubSubsOf;
    api.query.identity
      ?.subsOf(address, (subs) => {
        if (!subs) {
          dispatch(setSubsDeposits("0"));
          return;
        }
        const subsDeposit = subs[0]?.toBigInt().toString() || "0";
        dispatch(setSubsDeposits(subsDeposit));
        const subAccounts = subs[1] || [];
        api.query.identity.superOf.multi(subAccounts).then((supers) => {
          if (!supers) {
            return;
          }
          const subs = subAccounts.map((sub, index) => [
            sub.toJSON(),
            supers[index].unwrap()?.[1].asRaw.toHuman(),
          ]);
          dispatch(setSubs(subs));
        });
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
