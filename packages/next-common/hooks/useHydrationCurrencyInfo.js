import { useCallback, useEffect, useState, useMemo } from "react";
import { useTreasuryAccount } from "next-common/utils/hooks/useTreasuryFree";
import { useHydrationApi } from "next-common/hooks/chain/useHydrationApi";
import { isHex, hexToString } from "@polkadot/util";

const CURRENCIES_API_METHOD = "CurrenciesApi_account";
const RUNTIME_API_TYPE = "PalletCurrenciesRpcRuntimeApiAccountData";

function decodeMetadataField(field) {
  if (!field) return "";

  try {
    if (!isHex(field)) {
      return field;
    }

    return hexToString(field);
  } catch (error) {
    console.error("Error decoding metadata field:", error);
    return field;
  }
}

export function useHydrationCurrencyMetadata(currencyId) {
  const api = useHydrationApi();
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMetadata = useCallback(async () => {
    if (!api?.query?.assetRegistry || currencyId == null) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const metadataRaw = await api.query.assetRegistry.assets(currencyId);

      if (!metadataRaw || metadataRaw.isNone) {
        setMetadata(null);
        setLoading(false);
        return;
      }

      const metadataJson = metadataRaw.unwrap().toJSON();

      setMetadata({
        symbol: decodeMetadataField(metadataJson.symbol),
        decimals: metadataJson.decimals || 0,
        name: decodeMetadataField(metadataJson.name),
      });
    } catch (error) {
      console.error("Failed to fetch currency metadata:", error);
      setMetadata(null);
    } finally {
      setLoading(false);
    }
  }, [api, currencyId]);

  useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  return { metadata, loading };
}

export function useHydrationCurrencyAccountData(currencyId, accountAddress) {
  const api = useHydrationApi();
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(true);

  const callParams = useMemo(() => {
    if (!api?.registry || !accountAddress || currencyId == null) {
      return null;
    }

    try {
      const assetId = api.registry.createType("u32", currencyId);
      const accountId = api.registry.createType("AccountId", accountAddress);

      return new Uint8Array([...assetId.toU8a(), ...accountId.toU8a()]);
    } catch (error) {
      console.error("Error creating call parameters:", error);
      return null;
    }
  }, [api, accountAddress, currencyId]);

  const fetchData = useCallback(async () => {
    if (!api?.rpc?.state || !callParams) {
      return;
    }

    try {
      setLoading(true);

      const resultRaw = await api.rpc.state.call(
        CURRENCIES_API_METHOD,
        Array.from(callParams),
      );

      const accountData = api.registry.createType(RUNTIME_API_TYPE, resultRaw);
      setValue(accountData);
    } catch (error) {
      console.error("Failed to fetch currency account data:", error);
    } finally {
      setLoading(false);
    }
  }, [api, callParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { value, loading };
}

export function useHydrationCurrencyBalance(currencyId, accountAddress) {
  const api = useHydrationApi();
  const treasuryAccount = useTreasuryAccount(api);
  const targetAccount = accountAddress || treasuryAccount;

  const { value, loading } = useHydrationCurrencyAccountData(
    currencyId,
    targetAccount,
  );

  const balance = useMemo(() => {
    if (!value) {
      return null;
    }

    const totalBalance =
      (value.free?.toBigInt() || 0n) + (value.reserved?.toBigInt() || 0n);

    return totalBalance.toString();
  }, [value]);

  return { balance, loading };
}

export default function useHydrationCurrencyInfo(currencyId) {
  const { metadata, loading: metadataLoading } =
    useHydrationCurrencyMetadata(currencyId);
  const { balance, loading: balanceLoading } =
    useHydrationCurrencyBalance(currencyId);

  const loading = metadataLoading || balanceLoading;

  const data = useMemo(() => {
    if (!metadata || loading) {
      return null;
    }

    return {
      symbol: metadata.symbol,
      decimals: metadata.decimals,
      name: metadata.name,
      treasuryBalance: balance || "0",
    };
  }, [metadata, loading, balance]);

  return { data, loading };
}
