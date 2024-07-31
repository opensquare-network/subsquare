import { useContextApi } from "next-common/context/api";
import Prompt from "./prompt";
import { PromptTypes } from "next-common/components/scrollPrompt";
import { useConnectedAccount } from "next-common/context/connectedAccount";
import { useInjectedWeb3Extension } from "next-common/hooks/connect/useInjectedWeb3Extension";
import { CACHE_KEY } from "next-common/utils/constants";
import { useCallback, useEffect, useState } from "react";
import useChainInfo from "next-common/hooks/connect/useChainInfo";

function getPropertyStoreKey(genesisHash) {
  return `properties:${genesisHash.toHex()}`;
}

function getAllCachedProperties(api) {
  const storeKey = getPropertyStoreKey(api.genesisHash);
  let allProperties = {};
  try {
    const data = localStorage.getItem(storeKey);
    if (data) {
      allProperties = JSON.parse(data);
    }
  } catch (e) {
    // Ignore
  }
  return allProperties;
}

function getCachedProperties(api, { name }) {
  let allProperties = getAllCachedProperties(api);
  return allProperties[name];
}

function cacheProperties(api, name, { version }) {
  let allProperties = getAllCachedProperties(api);

  allProperties[name] = {
    extensionVersion: version,
    ss58Format: api.registry.chainSS58,
    tokenDecimals: api.registry.chainDecimals[0],
    tokenSymbol: api.registry.chainTokens[0],
  };

  const storeKey = getPropertyStoreKey(api.genesisHash);
  localStorage.setItem(storeKey, JSON.stringify(allProperties));
}

function checkPropertiesChange(api, extension) {
  const property = getCachedProperties(api, extension);
  if (property) {
    if (
      property.ss58Format !== api.registry.chainSS58 ||
      property.tokenDecimals !== api.registry.chainDecimals[0] ||
      property.tokenSymbol !== api.registry.chainTokens[0]
    ) {
      return true;
    }
  }
  return false;
}

export default function ExtensionUpdatePrompt() {
  const api = useContextApi();
  const connectedAccount = useConnectedAccount();
  const [isNeedUpdate, setIsNeedUpdate] = useState();
  const { injectedWeb3Extension, loading: isLoadingInjectedWeb3Extension } =
    useInjectedWeb3Extension(connectedAccount?.wallet);
  const chainInfo = useChainInfo();
  const [triggerCheck, setTriggerCheck] = useState(0);

  const checkNeedUpdate = useCallback(
    async (api, extension) => {
      if (!api || !extension) {
        return false;
      }

      const known = await extension.metadata.get();
      const current =
        known.find(({ genesisHash }) => api.genesisHash.eq(genesisHash)) ||
        null;
      return (
        api.runtimeVersion.specVersion.gtn(current?.specVersion) ||
        checkPropertiesChange(api, extension)
      );
    },
    [api],
  );

  useEffect(() => {
    if (!api || isLoadingInjectedWeb3Extension || !injectedWeb3Extension) {
      return;
    }

    injectedWeb3Extension
      .enable("subsquare")
      .then(async (extension) => {
        const isNeedUpdate = await checkNeedUpdate(api, extension);
        setIsNeedUpdate(isNeedUpdate);
      })
      .catch(console.error);
  }, [
    api,
    injectedWeb3Extension,
    isLoadingInjectedWeb3Extension,
    triggerCheck,
  ]);

  const updateMeta = useCallback(
    async (def) => {
      if (!injectedWeb3Extension) {
        return;
      }

      try {
        const extension = await injectedWeb3Extension.enable("subsquare");
        const isOk = await extension.metadata.provide(def);
        if (isOk) {
          cacheProperties(api, connectedAccount?.wallet, injectedWeb3Extension);
          setTriggerCheck((v) => v + 1);
        }
      } catch (e) {
        console.error(e);
      }
    },
    [api, injectedWeb3Extension, connectedAccount?.wallet],
  );

  if (!isNeedUpdate) {
    return null;
  }

  return (
    <Prompt
      cacheKey={CACHE_KEY.extensionUpdateMetadata}
      type={PromptTypes.WARNING}
    >
      The extension can be updated with the latest chain metadata and
      properties.&nbsp;
      <span
        className="cursor-pointer underline"
        onClick={() => updateMeta(chainInfo)}
      >
        Update
      </span>
    </Prompt>
  );
}
