"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { createSdkContext } from "@galacticcouncil/sdk";
import { ApiPromise, WsProvider } from "@polkadot/api";
import getChainSettings from "next-common/utils/consts/settings";
import Chains from "next-common/utils/consts/chains";

const HydrationSDKContext = createContext(null);

export function HydrationSDKProvider({ children }) {
  const [state, setState] = useState({
    api: null,
    sdk: null,
    isInitializing: true,
  });
  const hydrationEndpoints = useMemo(() => {
    const { endpoints } = getChainSettings(Chains.hydradx);
    return endpoints?.map((item) => item.url) ?? [];
  }, []);

  useEffect(() => {
    let isMounted = true;
    let apiInstance = null;
    if (!hydrationEndpoints || hydrationEndpoints.length === 0) {
      return;
    }

    async function initializeHydration() {
      try {
        const wsProvider = new WsProvider(hydrationEndpoints, 1000);

        apiInstance = await ApiPromise.create({
          provider: wsProvider,
        });

        const sdkInstance = await createSdkContext(apiInstance);

        if (isMounted) {
          setState({
            api: apiInstance,
            sdk: sdkInstance,
            isInitializing: false,
          });
        }
      } catch (error) {
        console.error("Failed to initialize Hydration SDK:", error);
        if (isMounted) {
          setState({
            api: null,
            sdk: null,
            isInitializing: false,
          });
        }
      }
    }

    initializeHydration();

    return () => {
      isMounted = false;
      if (apiInstance) {
        apiInstance.disconnect();
      }
    };
  }, [hydrationEndpoints]);

  return (
    <HydrationSDKContext.Provider value={state}>
      {children}
    </HydrationSDKContext.Provider>
  );
}

export function useHydrationSDKContext() {
  const context = useContext(HydrationSDKContext);
  return context;
}

export function useHydrationApi() {
  const { api } = useHydrationSDKContext();
  return api;
}

export function useHydrationSDK() {
  const { sdk } = useHydrationSDKContext();
  return sdk;
}
