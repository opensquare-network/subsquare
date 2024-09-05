import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useSymbol } from "next-common/context/chain";
import { setMyAccountInfo } from "next-common/store/reducers/myOnChainData/account";
import { useContextApi } from "next-common/context/api";

export default function useSubKintsugiAccount() {
  const realAddress = useRealAddress();
  const api = useContextApi();
  const dispatch = useDispatch();
  const symbol = useSymbol();

  useEffect(() => {
    if (!api || !api.query.tokens?.accounts) {
      return;
    }

    let unsub;
    api.query.tokens
      .accounts(realAddress, { token: symbol }, (info) => {
        const free = info.free.toString();
        const reserved = info.reserved.toString();
        const frozen = info.frozen.toString();

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
  }, [api, realAddress, dispatch, symbol]);
}
