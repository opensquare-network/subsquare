import { useCallback } from "react";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import {
  fetchMultisigList10Times,
  fetchMultisigsCount10Times,
} from "../../common";
import { useChain } from "next-common/context/chain";
import { myMultisigsSelector } from "next-common/store/reducers/multisigSlice";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useSelector } from "react-redux";

export function useMultisigListFetchFunc() {
  const dispatch = useDispatch();
  const chain = useChain();
  const address = useRealAddress();
  const myMultisigs = useSelector(myMultisigsSelector);
  const { page = 1 } = myMultisigs || {};

  return useCallback(() => {
    dispatch(newSuccessToast("Multisig status will be updated in seconds"));
    fetchMultisigList10Times(dispatch, chain, address, page).then(() => {
      // updated 10 time, do nothing
    });
    fetchMultisigsCount10Times(dispatch, chain, address).then(() => {
      // updated 10 time, do nothing
    });
  }, [dispatch, chain, address, page]);
}
