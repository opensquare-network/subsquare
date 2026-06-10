import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createGlobalState } from "react-use";
import { useChain, useChainSettings } from "next-common/context/chain";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { useContextApi } from "next-common/context/api";

export const NATIVE_ASSET_TYPE = "native";

const FeeAssetContext = createContext();

export default FeeAssetContext;

function buildXcmLocation(generalIndex) {
  return {
    V4: {
      parents: 0,
      interior: {
        X2: [{ PalletInstance: 50 }, { GeneralIndex: generalIndex }],
      },
    },
  };
}

function buildForeignAssetXcmLocation(junctions, parents = 0) {
  const key = `X${junctions.length}`;
  return {
    V4: {
      parents,
      interior: { [key]: junctions },
    },
  };
}

const CHAIN_FEE_ASSET_CONFIGS = {
  polkadot: [
    {
      type: "asset",
      symbol: "USDC",
      assetId: 1337,
      decimals: 6,
      name: "USDC",
      multiLocation: buildXcmLocation(1337),
    },
    {
      type: "asset",
      symbol: "USDT",
      assetId: 1984,
      decimals: 6,
      name: "USDT",
      multiLocation: buildXcmLocation(1984),
    },
  ],
  kusama: [
    {
      type: "asset",
      symbol: "USDT",
      assetId: 1984,
      decimals: 6,
      name: "USDT",
      multiLocation: buildXcmLocation(1984),
    },
    {
      type: "foreignAsset",
      symbol: "DOT",
      assetId: null,
      decimals: 10,
      name: "DOT",
      multiLocation: buildForeignAssetXcmLocation(
        [{ GlobalConsensus: { Polkadot: null } }],
        2,
      ),
    },
    {
      type: "foreignAsset",
      symbol: "USDC",
      assetId: 1337,
      decimals: 6,
      name: "USDC (Polkadot)",
      multiLocation: buildForeignAssetXcmLocation(
        [
          { GlobalConsensus: { Polkadot: null } },
          { Parachain: 1000 },
          { PalletInstance: 50 },
          { GeneralIndex: 1337 },
        ],
        2,
      ),
    },
    {
      type: "foreignAsset",
      symbol: "USDT",
      assetId: 1984,
      decimals: 6,
      name: "USDT (Polkadot)",
      multiLocation: buildForeignAssetXcmLocation(
        [
          { GlobalConsensus: { Polkadot: null } },
          { Parachain: 1000 },
          { PalletInstance: 50 },
          { GeneralIndex: 1984 },
        ],
        2,
      ),
    },
  ],
  paseo: [
    {
      type: "asset",
      symbol: "USDC",
      assetId: 1337,
      decimals: 6,
      name: "USDC",
      multiLocation: buildXcmLocation(1337),
    },
    {
      type: "asset",
      symbol: "USDT",
      assetId: 1984,
      decimals: 6,
      name: "USDT",
      multiLocation: buildXcmLocation(1984),
    },
  ],
};

function findAssetConfig(chain, feeAssetType) {
  const assets = CHAIN_FEE_ASSET_CONFIGS[chain];
  if (!assets) return null;
  return assets.find((a) => a.name === feeAssetType) || null;
}

export function getChainFeeAssets(chain) {
  return CHAIN_FEE_ASSET_CONFIGS[chain] || [];
}

function findAssetType(chain, assetId) {
  const assets = CHAIN_FEE_ASSET_CONFIGS[chain];
  if (!assets) return null;
  const asset = assets.find((a) => a.type === "asset" && a.assetId === assetId);
  return asset?.name || null;
}

export function getFeeAssetTypeKey(assetId, chain) {
  return findAssetType(chain, assetId);
}

export function getFeeAssetTypes(chain) {
  const config = CHAIN_FEE_ASSET_CONFIGS[chain];
  return config?.map((a) => a.name) || [];
}

export function getFeeAssetConfig(chain, name) {
  const config = CHAIN_FEE_ASSET_CONFIGS[chain];
  if (!config) return null;
  return config.find((a) => a.name === name) || null;
}

export function getForeignAssetLocation(chain, name) {
  const config = getFeeAssetConfig(chain, name);
  if (!config || config.type !== "foreignAsset") return null;
  return config.multiLocation || null;
}

function getForeignAssetStorageLocation(location) {
  return (
    location?.V4 || location?.V3 || location?.V2 || location?.V1 || location
  );
}

function getForeignAssetNameByLocation(location, chain) {
  if (!location || !chain) return null;
  const configs = getChainFeeAssets(chain);
  const config = configs.find(
    (c) =>
      c.type === "foreignAsset" &&
      JSON.stringify(c.multiLocation) === JSON.stringify(location),
  );
  return config?.name || null;
}

function getInitialCachedBalances() {
  const balances = { [NATIVE_ASSET_TYPE]: null };
  for (const key of getFeeAssetTypes(process.env.NEXT_PUBLIC_CHAIN)) {
    balances[key] = null;
  }
  return balances;
}

const useAssetCachedBalances = createGlobalState(getInitialCachedBalances());

export function useNativeBalance() {
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const [cachedBalances, setCachedBalances] = useAssetCachedBalances();
  const cached = cachedBalances?.[NATIVE_ASSET_TYPE];
  const [balance, setBalance] = useState(cached);
  const [isLoading, setIsLoading] = useState(cached == null);

  useEffect(() => {
    if (!api || !signerAccount?.realAddress) return;
    setIsLoading(cached == null);

    api.query.system
      .account(signerAccount.realAddress)
      .then((acc) => {
        const val = acc.data.free;
        setBalance(val);
        setCachedBalances((prev) => ({
          ...prev,
          [NATIVE_ASSET_TYPE]: val,
        }));
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, signerAccount?.realAddress]);

  return { balance, isLoading };
}

export function useAssetBalance(assetId) {
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const chain = useChain();
  const [cachedBalances, setCachedBalances] = useAssetCachedBalances();

  const balanceKey = chain ? getFeeAssetTypeKey(assetId, chain) : null;
  const cached = balanceKey ? cachedBalances?.[balanceKey] : null;
  const [balance, setBalance] = useState(cached);
  const [isLoading, setIsLoading] = useState(cached == null);

  useEffect(() => {
    if (!api || !signerAccount?.realAddress || assetId == null) return;
    setIsLoading(cached == null);

    api.query.assets
      .account(assetId, signerAccount.realAddress)
      .then((data) => {
        const val = data?.unwrapOr(null)?.balance?.toBigInt() || 0n;
        setBalance(val);
        const key = getFeeAssetTypeKey(assetId, chain);
        if (key) {
          setCachedBalances((prev) => ({ ...prev, [key]: val }));
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, signerAccount?.realAddress, assetId]);

  return { balance, isLoading };
}

export function useForeignAssetBalance(location) {
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const chain = useChain();
  const [cachedBalances, setCachedBalances] = useAssetCachedBalances();

  const name = getForeignAssetNameByLocation(location, chain);
  const cached = name ? cachedBalances?.[name] : null;
  const [balance, setBalance] = useState(cached);
  const [isLoading, setIsLoading] = useState(cached == null);

  useEffect(() => {
    const storageLocation = getForeignAssetStorageLocation(location);

    if (!api || !signerAccount?.realAddress || !storageLocation) {
      setIsLoading(false);
      return;
    }
    setIsLoading(cached == null);

    api.query.foreignAssets
      .account(storageLocation, signerAccount.realAddress)
      .then((data) => {
        const val = data?.unwrapOr(null)?.balance?.toBigInt() || 0n;
        setBalance(val);
        if (name) {
          setCachedBalances((prev) => ({ ...prev, [name]: val }));
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, signerAccount?.realAddress, name]);

  return { balance, isLoading };
}

export function useFeeAssetInfo(feeAssetType) {
  const { symbol, decimals } = useChainSettings();
  const chain = useChain();

  return useMemo(() => {
    if (feeAssetType === NATIVE_ASSET_TYPE) {
      return {
        type: NATIVE_ASSET_TYPE,
        symbol,
        assetId: null,
        decimals,
        name: symbol,
        location: null,
      };
    }

    const config = findAssetConfig(chain, feeAssetType);
    if (!config) {
      throw new Error(
        `Unsupported fee asset type ${feeAssetType} on chain ${chain}`,
      );
    }

    return {
      type: config.type,
      symbol: config.symbol,
      assetId: config.assetId,
      decimals: config.decimals,
      name: config.name,
      location: config.multiLocation,
    };
  }, [feeAssetType, symbol, decimals, chain]);
}

export function FeeAssetProvider({ children }) {
  const [feeAssetType, setFeeAssetTypeState] = useState(NATIVE_ASSET_TYPE);
  const feeAssetInfo = useFeeAssetInfo(feeAssetType);
  const chain = useChain();

  const setFeeAssetType = useCallback(
    (type) => {
      if (
        type === NATIVE_ASSET_TYPE ||
        getFeeAssetTypes(chain).includes(type)
      ) {
        setFeeAssetTypeState(type);
      }
    },
    [chain],
  );

  return (
    <FeeAssetContext.Provider
      value={{ feeAssetType, feeAssetInfo, setFeeAssetType }}
    >
      {children}
    </FeeAssetContext.Provider>
  );
}

export function useFeeAssetConfig() {
  const context = useContext(FeeAssetContext);
  const { symbol, decimals } = useChainSettings();
  const defaultInfo = useMemo(
    () => ({
      feeAssetType: NATIVE_ASSET_TYPE,
      feeAssetInfo: {
        type: NATIVE_ASSET_TYPE,
        symbol,
        decimals,
        name: symbol,
        location: null,
      },
      setFeeAssetType: () => {},
    }),
    [symbol, decimals],
  );
  if (!context) {
    return defaultInfo;
  }
  return context;
}
