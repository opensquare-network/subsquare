import { reject } from "lodash-es";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import ChainTypes from "next-common/utils/consts/chainTypes";
import { normalizedSubstrateAccounts } from "next-common/utils/substrate";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useMountedState } from "react-use";

export function useSubstrateInjectedAccounts({ defaultLoading = false } = {}) {
  const dispatch = useDispatch();
  const isMounted = useMountedState();
  const [loading, setLoading] = useState(defaultLoading);

  const [accounts, setAccounts] = useState([]);

  const loadInjectedAccounts = useCallback(async () => {
    setLoading(true);

    const { web3Enable, web3Accounts } = await import(
      "@polkadot/extension-dapp"
    );

    try {
      await web3Enable("subsquare");
      const injectedAccounts = reject(await web3Accounts(), {
        type: ChainTypes.ETHEREUM,
      });

      if (isMounted()) {
        setAccounts(normalizedSubstrateAccounts(injectedAccounts));
      }
    } catch (e) {
      dispatch(newErrorToast(e.message));
    } finally {
      setLoading(false);
    }
  }, [isMounted, dispatch]);

  useEffect(() => {
    if (isMounted()) {
      loadInjectedAccounts();
    }
  }, [isMounted, loadInjectedAccounts]);

  return {
    accounts,
    loading,
  };
}
