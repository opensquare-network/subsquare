import BigNumber from "bignumber.js";
import { useContextApi } from "next-common/context/api";
import { useEffect, useMemo } from "react";
import { useKnownAssetHubAssets } from "next-common/components/assets/known";
import useAllAssetMetadata from "next-common/components/assets/context/assetMetadata";
import {
  fetchMultiAccounts,
  multiAccountsSelector,
} from "next-common/store/reducers/multiAccountsSlice";
import { useDispatch, useSelector } from "react-redux";
import { isNil } from "lodash-es";

export function useMultiAccountsDeps(address) {
  const [allMetadata] = useAllAssetMetadata();
  const multiAccountKey = useMemo(
    () => allMetadata?.map((item) => [item.assetId, address]),
    [allMetadata, address],
  );
  return {
    multiAccountKey,
    allMetadata,
  };
}

export default function useSingleAccountAssets(address) {
  const dispatch = useDispatch();
  const api = useContextApi();
  const { multiAccountKey, allMetadata } = useMultiAccountsDeps(address);

  useEffect(() => {
    dispatch(fetchMultiAccounts(multiAccountKey, api));
  }, [dispatch, multiAccountKey, api]);
  const multiAccounts = useSelector(multiAccountsSelector);
  const knownAssetDefs = useKnownAssetHubAssets();

  return useMemo(() => {
    if (!allMetadata || !multiAccounts) {
      return null;
    }

    const assets = (allMetadata || []).reduce((result, item, index) => {
      const account = multiAccounts[index];
      if (isNil(account)) {
        return result;
      }

      const balance = account.balance.toString();
      const transferrable = account.status.isFrozen ? 0 : balance;
      return [...result, { ...item, balance, transferrable }];
    }, []);

    const knownAssets = knownAssetDefs.reduce((result, def) => {
      const find = assets.find((asset) => asset.assetId === def.assetId);
      if (find) {
        return [...result, find];
      } else {
        return result;
      }
    }, []);
    const knownAssetIds = knownAssetDefs.map((def) => def.assetId);
    const otherAssets = assets.filter(
      (asset) => !knownAssetIds.includes(asset.assetId),
    );

    const tokens = [...knownAssets, ...otherAssets];

    return tokens.filter((item) => !new BigNumber(item.balance || 0).isZero());
  }, [allMetadata, multiAccounts, knownAssetDefs]);
}
