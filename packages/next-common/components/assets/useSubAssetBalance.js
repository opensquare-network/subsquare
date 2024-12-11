import useSubStorage from "next-common/hooks/common/useSubStorage";
import useAllAssetMetadata from "next-common/components/assets/context/assetMetadata";
import { useMemo, useState, useEffect } from "react";
import { useContextApi } from "next-common/context/api";
import { isNil } from "lodash";

export function useMultiAccountKeyDeps(address) {
  const [allMetadata] = useAllAssetMetadata();
  const multiAccountKey = useMemo(
    () => allMetadata?.map((item) => [item.assetId, address]),
    [allMetadata, address],
  );
  return { multiAccountKey, allMetadata };
}

export function useQueryAssetsDeps(address) {
  const api = useContextApi();
  const { multiAccountKey, allMetadata } = useMultiAccountKeyDeps(address);
  const [multiAccounts, setMultiAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!api || !multiAccountKey) {
      return;
    }

    api.query.assets.account
      .multi(multiAccountKey)
      .then((result) => {
        const multiAccounts = result?.map((option) => {
          if (option.isNone) {
            return null;
          }

          const { balance, status = {} } = option.unwrap();
          const { isFrozen } = status;

          return {
            option: option.unwrap(),
            balance: balance.toJSON(),
            status: {
              isFrozen,
            },
          };
        });

        setMultiAccounts(multiAccounts);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [api, multiAccountKey]);

  const assets = (allMetadata || []).reduce((result, item, index) => {
    const account = multiAccounts[index];
    if (isNil(account)) {
      return result;
    }

    const balance = account.balance.toString();
    const transferrable = account.status.isFrozen ? 0 : balance;
    return [...result, { ...item, balance, transferrable }];
  }, []);

  return {
    assets,
    loading,
  };
}

export default function useSubAssetBalance(assetId, address) {
  const { result, loading } = useSubStorage("assets", "account", [
    assetId,
    address,
  ]);

  const data = result?.unwrap();
  const balance = data?.balance?.toString() || 0;
  const isFrozen = data?.status?.isFrozen;
  const transferrable = isFrozen ? 0 : balance;

  return {
    result: {
      balance,
      transferrable,
      isFrozen,
    },
    loading,
  };
}
