import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect } from "react";
import useApi from "next-common/utils/hooks/useApi";
import { useDispatch } from "react-redux";
import { setMyAccountInfo } from "next-common/store/reducers/myOnChainData/account";

export default function useSubscribeAccount() {
  const realAddress = useRealAddress();
  const api = useApi();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!api || !api.query.system?.account) {
      return;
    }

    let unsub;
    api.query.system
      .account(realAddress, (info) => {
        const free = info.data.free.toString();
        const reserved = info.data.reserved.toString();
        const frozen = info.data.frozen.toString();

        dispatch(
          setMyAccountInfo({
            free,
            reserved,
            frozen,
          }),
        );
      })
      .then((result) => (unsub = result));

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api, realAddress, dispatch]);
}
