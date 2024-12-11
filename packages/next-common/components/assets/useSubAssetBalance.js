import useSubStorage from "next-common/hooks/common/useSubStorage";
import useAllAssetMetadata from "next-common/components/assets/context/assetMetadata";
import { useMemo, useState, useEffect } from "react";
import { useContextApi } from "next-common/context/api";
import BigNumber from "bignumber.js";

export function useMultiAccountKeyDeps(address) {
  const [allMetadata] = useAllAssetMetadata();
  const multiAccountKey = useMemo(
    () => allMetadata?.map((item) => [item.assetId, address]),
    [allMetadata, address],
  );
  return multiAccountKey;
}

export function useSubAssetBalanceDeps(address) {
  const api = useContextApi();
  const multiAccountKey = useMultiAccountKeyDeps(address);
  const [multiAccounts, setMultiAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!api || !multiAccountKey) {
      return;
    }

    api.query.assets.account
      .multi(multiAccountKey)
      .then((result) => {
        const multiAccounts = result
          ?.map((option) => {
            if (option.isNone) {
              return null;
            }

            const { balance, status = {} } = option.unwrap();
            const { isFrozen } = status;

            return {
              balance: balance.toJSON(),
              status: {
                isFrozen,
              },
            };
          })
          .filter(Boolean)
          .filter((item) => !new BigNumber(item.balance || 0).isZero());

        setMultiAccounts(multiAccounts);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [api, multiAccountKey]);

  return {
    multiAccounts,
    loading,
  };
}

export default function useSubAssetBalance(assetId, address) {
  const { result, loading } = useSubStorage("assets", "account", [
    assetId,
    address,
  ]);

  return {
    result: result?.toJSON()?.balance || 0,
    loading,
  };
}
