import { useEffect } from "react";
import { useDispatch } from "react-redux";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useSubscribeIdentityDeposit from "next-common/hooks/account/deposit/fetch/identity";
import {
  setIdentityAddress,
  setIdentityDeposit,
  setIdentityDisplayName,
  setSubs,
  setSubsDeposits,
} from "next-common/store/reducers/myOnChainData/deposits/myIdentityDeposits";

export default function useSubMyIdentityDeposit() {
  const dispatch = useDispatch();
  const address = useRealAddress();

  const { identityName, identityDeposit, subsDeposit, subs } =
    useSubscribeIdentityDeposit(address);

  useEffect(() => {
    dispatch(setIdentityAddress(address));
    dispatch(setIdentityDisplayName(identityName));
    dispatch(setIdentityDeposit(identityDeposit));
    dispatch(setSubsDeposits(subsDeposit));
    dispatch(setSubs(subs));
  }, [identityName, identityDeposit, subsDeposit, subs, dispatch, address]);
}
