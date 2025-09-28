import { useHydrationApi } from "next-common/hooks/chain/useHydrationApi";
import { createSdkContext } from "@galacticcouncil/sdk";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { useState, useCallback, useEffect, useMemo } from "react";
import {
  AaveV3HydrationTestnet,
  AaveV3HydrationMainnet,
  isTestnetRpcUrl,
  isPaseoRpcUrl,
  reserveSortFn,
  fetchIconSymbolAndName,
} from "./utils";

import {
  UiIncentiveDataProvider,
  UiPoolDataProvider,
} from "@aave/contract-helpers";
import {
  formatReservesAndIncentives,
  formatUserSummaryAndIncentives,
  valueToBigNumber,
  WEI_DECIMALS,
} from "@aave/math-utils";
import { normalizeAddress } from "next-common/utils/address";
import { produce } from "immer";

//  Hydration SDK in provider?
const ws = "wss://rpc.hydradx.cloud";
const wsProvider = new WsProvider(ws, 2_500, {}, 60_000, 102400, 10 * 60_000);

const api = await ApiPromise.create({
  provider: wsProvider,
});

const sdk = await createSdkContext(api);

const formatReserveIncentives = (reserveIncentives) => {
  return reserveIncentives.map((incentive) => {
    if (!incentive.aIncentiveData.rewardsTokenInformation.length) {
      return incentive;
    }

    return produce(incentive, (draft) => {
      draft.aIncentiveData.rewardsTokenInformation.forEach((reward) => {
        // emissionPerSecond is expected to be in WEI, so we need to convert it to the correct decimals
        reward.emissionPerSecond = valueToBigNumber(reward.emissionPerSecond)
          .shiftedBy(WEI_DECIMALS - reward.rewardTokenDecimals)
          .toString();
      });
    });
  });
};

const useBorrowUserIncentives = (address) => {
  const incentivesContract = useBorrowIncentivesContract();
  const addresses = useBorrowContractAddresses();
  const evmAddress = normalizeAddress(address);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const lendingPoolAddressProvider = addresses?.POOL_ADDRESSES_PROVIDER ?? "";

  const fetchBorrowUserIncentives = useCallback(() => {
    if (!incentivesContract || !evmAddress || !lendingPoolAddressProvider) {
      return null;
    }

    setIsLoading(true);

    try {
      const userIncentives =
        incentivesContract.getUserReservesIncentivesDataHumanized({
          lendingPoolAddressProvider,
          user: evmAddress,
        });
      setData(userIncentives);
    } catch (error) {
      console.error("Error fetching borrow user incentives:", error);
    } finally {
      setIsLoading(false);
    }
  }, [incentivesContract, evmAddress, lendingPoolAddressProvider]);
  useEffect(() => {
    fetchBorrowUserIncentives();
  }, [fetchBorrowUserIncentives]);

  return { data, isLoading };
};

const useBorrowIncentivesContract = () => {
  const { evm } = sdk ?? {};
  const addresses = useBorrowContractAddresses();

  return useMemo(() => {
    if (!addresses) return null;

    return new UiIncentiveDataProvider({
      uiIncentiveDataProviderAddress: addresses.UI_INCENTIVE_DATA_PROVIDER,
      provider: evm,
      chainId: parseFloat(import.meta.env.VITE_EVM_CHAIN_ID),
    });
  }, [addresses, evm]);
};

const useBorrowIncentives = () => {
  const incentivesContract = useBorrowIncentivesContract();
  const addresses = useBorrowContractAddresses();

  const lendingPoolAddressProvider = addresses?.POOL_ADDRESSES_PROVIDER ?? "";

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBorrowIncentives = useCallback(async () => {
    if (
      !lendingPoolAddressProvider ||
      !incentivesContract ||
      !incentivesContract ||
      !addresses
    ) {
      return;
    }

    try {
      setIsLoading(true);
      const incentives =
        await incentivesContract.getReservesIncentivesDataHumanized({
          lendingPoolAddressProvider,
        });

      setData(formatReserveIncentives(incentives));
    } catch (error) {
      console.error("Error fetching borrow incentives:", error);
    } finally {
      setIsLoading(false);
    }
  }, [incentivesContract, addresses, lendingPoolAddressProvider]);

  useEffect(() => {
    fetchBorrowIncentives();
  }, [fetchBorrowIncentives]);

  return { data, isLoading };
};

const useBorrowContractAddresses = () => {
  const { isLoaded, evm } = sdk ?? {};

  return useMemo(() => {
    if (!isLoaded) return null;
    if (isPaseoRpcUrl(evm.connection.url)) {
      return AaveV3HydrationMainnet;
    }
    const isTestnet = isTestnetRpcUrl(evm.connection.url);
    return isTestnet ? AaveV3HydrationTestnet : AaveV3HydrationMainnet;
  }, [evm, isLoaded]);
};

const useBorrowPoolDataContract = () => {
  const { evm } = sdk ?? {};
  const addresses = useBorrowContractAddresses();

  return useMemo(() => {
    if (!addresses) return null;

    return new UiPoolDataProvider({
      uiPoolDataProviderAddress: addresses.UI_POOL_DATA_PROVIDER,
      provider: evm,
      chainId: parseFloat(import.meta.env.VITE_EVM_CHAIN_ID),
    });
  }, [addresses, evm]);
};

const useBorrowReserves = () => {
  const api = useHydrationApi();
  const poolDataContract = useBorrowPoolDataContract();
  const addresses = useBorrowContractAddresses();

  const { data: reserveIncentives, isSuccess: isIncentivesSuccess } =
    useBorrowIncentives();

  const lendingPoolAddressProvider = addresses?.POOL_ADDRESSES_PROVIDER ?? "";

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBorrowReserves = useCallback(async () => {
    if (
      !poolDataContract ||
      (!lendingPoolAddressProvider && !poolDataContract) ||
      !isIncentivesSuccess ||
      !api
    ) {
      return;
    }

    try {
      setIsLoading(true);
      const [reserves, timestamp] = await Promise.all([
        poolDataContract.getReservesHumanized({
          lendingPoolAddressProvider,
        }),
        api.query.timestamp.now(),
      ]);

      const { baseCurrencyData, reservesData } = reserves;
      const currentTimestamp = timestamp.toNumber() / 1000;

      const formattedReserves = formatReservesAndIncentives({
        currentTimestamp,
        reserves: reservesData,
        marketReferencePriceInUsd:
          baseCurrencyData.marketReferenceCurrencyPriceInUsd,
        marketReferenceCurrencyDecimals:
          baseCurrencyData.marketReferenceCurrencyDecimals,
        reserveIncentives: reserveIncentives ?? [],
      })
        .map((r) => ({
          ...r,
          ...fetchIconSymbolAndName(r),
          isEmodeEnabled: r.eModeCategoryId !== 0,
          isWrappedBaseAsset: false,
        }))
        .sort(reserveSortFn);

      setData({
        formattedReserves,
        baseCurrencyData,
      });
    } catch (error) {
      console.error("Error fetching borrow reserves:", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    api,
    isIncentivesSuccess,
    lendingPoolAddressProvider,
    poolDataContract,
    reserveIncentives,
  ]);

  useEffect(() => {
    fetchBorrowReserves();
  }, [fetchBorrowReserves]);

  return { data, isLoading };
};

function useUserBorrowSummary(address) {
  const api = useHydrationApi();
  const { data: reserves, isSuccess: isReservesSuccess } = useBorrowReserves();
  const { data: reserveIncentives, isSuccess: isIncentivesSuccess } =
    useBorrowIncentives();
  const { data: userIncentives } = useBorrowUserIncentives();

  const poolDataContract = useBorrowPoolDataContract();
  const addresses = useBorrowContractAddresses();

  const evmAddress = normalizeAddress(address);

  const lendingPoolAddressProvider = addresses?.POOL_ADDRESSES_PROVIDER ?? "";

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBorrowUserSummary = useCallback(async () => {
    if (
      !isReservesSuccess ||
      !isIncentivesSuccess ||
      !lendingPoolAddressProvider ||
      !evmAddress ||
      !reserves ||
      !poolDataContract ||
      !api
    ) {
      return;
    }

    try {
      setIsLoading(true);
      const [user, timestamp] = await Promise.all([
        poolDataContract.getUserReservesHumanized({
          lendingPoolAddressProvider,
          user: evmAddress,
        }),
        api.query.timestamp.now(),
      ]);

      const { baseCurrencyData, formattedReserves } = reserves;
      const { userEmodeCategoryId, userReserves } = user;

      const currentTimestamp = timestamp.toNumber() / 1000;

      const summary = formatUserSummaryAndIncentives({
        currentTimestamp,
        marketReferencePriceInUsd:
          reserves.baseCurrencyData.marketReferenceCurrencyPriceInUsd,
        marketReferenceCurrencyDecimals:
          baseCurrencyData.marketReferenceCurrencyDecimals,
        userReserves,
        formattedReserves,
        userEmodeCategoryId,
        reserveIncentives: reserveIncentives ?? [],
        userIncentives: userIncentives ?? [],
      });

      const extendedUser = {
        ...summary,
        isInEmode: userEmodeCategoryId !== 0,
        userEmodeCategoryId,
        // @TODO: calculate correct user APYs when we need to access them outside of MoneyMarket
        earnedAPY: 0,
        debtAPY: 0,
        netAPY: 0,
      };

      setData(extendedUser);
    } catch (error) {
      console.error("Error fetching borrow user summary:", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    api,
    evmAddress,
    isIncentivesSuccess,
    isReservesSuccess,
    lendingPoolAddressProvider,
    poolDataContract,
    reserveIncentives,
    reserves,
    userIncentives,
  ]);

  useEffect(() => {
    fetchBorrowUserSummary();
  }, [fetchBorrowUserSummary]);

  return { borrows: data, isLoading };
}

export default function useBorrowsTotal(address) {
  const { borrows, isLoading } = useUserBorrowSummary(address);
  return { balance: borrows?.data?.totalBorrowsUSD ?? "0", isLoading };
}
