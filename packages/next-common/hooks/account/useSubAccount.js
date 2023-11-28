import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect } from "react";
import useApi from "next-common/utils/hooks/useApi";
import { useDispatch } from "react-redux";
import { setMyAccountInfo } from "next-common/store/reducers/myOnChainData/account";
import BigNumber from "bignumber.js";

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
        let frozen;
        if (info.data.frozen) {
          frozen = info.data.frozen.toString();
        } else if (info.data.miscFrozen && info.data.feeFrozen) {
          frozen = BigNumber.max(
            info.data.miscFrozen.toString(),
            info.data.feeFrozen.toString(),
          ).toString();
        }

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
