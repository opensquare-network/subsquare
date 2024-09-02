import { useContextApi } from "next-common/context/api";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setExistentialDeposit } from "next-common/store/reducers/chainSlice";

export default function useExistentialDeposit() {
  const api = useContextApi();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!api) {
      return;
    }

    if (api.consts.balances?.existentialDeposit) {
      dispatch(setExistentialDeposit(api.consts.balances?.existentialDeposit.toNumber()));
    } else {
      dispatch(setExistentialDeposit(0));
    }
  }, [api, dispatch]);
}
