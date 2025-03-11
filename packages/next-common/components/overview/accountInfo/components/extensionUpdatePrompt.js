import { useContextApi } from "next-common/context/api";
import Prompt from "./prompt";
import { PromptTypes } from "next-common/components/scrollPrompt";
import { useConnectedAccount } from "next-common/context/connectedAccount";
import { useInjectedWeb3Extension } from "next-common/hooks/connect/useInjectedWeb3Extension";
import { CACHE_KEY } from "next-common/utils/constants";
import { useCallback, useEffect, useState } from "react";
import useChainInfo from "next-common/hooks/connect/useChainInfo";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";

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

function PromptContent({ onUpdateMeta }) {
  return (
    <div>
      The extension can be updated with the latest chain metadata and
      properties.&nbsp;
      <span
        role="button"
        className="cursor-pointer underline"
        onClick={onUpdateMeta}
      >
        Update
      </span>
    </div>
  );
}

export default function ExtensionUpdatePrompt({ isWithCache = true }) {
  const dispatch = useDispatch();
  const api = useContextApi();
  const connectedAccount = useConnectedAccount();
  const [isNeedUpdate, setIsNeedUpdate] = useState();
  const { injectedWeb3Extension, loading: isLoadingInjectedWeb3Extension } =
    useInjectedWeb3Extension(connectedAccount?.wallet);
  const chainInfo = useChainInfo();
  const [triggerCheck, setTriggerCheck] = useState(0);

  const checkNeedUpdate = useCallback(async (api, extension) => {
    if (!api || !extension) {
      return false;
    }

    alert("checkNeedUpdate");
    try {
      const known = await extension.metadata.get();
      alert({ known: !!known });
      const current =
        known.find(({ genesisHash }) => api.genesisHash.eq(genesisHash)) ||
        null;
      alert(JSON.stringify({ current: !!current }));
      alert(
        JSON.stringify({
          specVersion1: api.runtimeVersion.specVersion.toString(),
          specVersion2: current?.specVersion.toString(),
        }),
      );
      alert(
        JSON.stringify({
          currentSpecVersion: checkPropertiesChange(api, extension),
        }),
      );

      return (
        !current ||
        api.runtimeVersion.specVersion.gtn(current?.specVersion) ||
        checkPropertiesChange(api, extension)
      );
    } catch (e) {
      alert(e.message);
    }
  }, []);

  useEffect(() => {
    alert("useEffect");
    if (!api || isLoadingInjectedWeb3Extension || !injectedWeb3Extension) {
      return;
    }
    alert("before injectedWeb3Extension.enable");

    injectedWeb3Extension
      .enable("subsquare")
      .then(async (extension) => {
        alert(JSON.stringify({ extension: !!extension }));
        const isNeedUpdate = await checkNeedUpdate(api, extension);
        alert(JSON.stringify({ isNeedUpdate }));
        setIsNeedUpdate(isNeedUpdate);
      })
      .catch(console.error);
  }, [
    api,
    checkNeedUpdate,
    injectedWeb3Extension,
    isLoadingInjectedWeb3Extension,
    triggerCheck,
  ]);

  const updateMeta = useCallback(
    async (def) => {
      alert("updateMeta");
      if (!injectedWeb3Extension) {
        return;
      }

      alert("before injectedWeb3Extension.enable");

      try {
        const extension = await injectedWeb3Extension.enable("subsquare");
        alert("after injectedWeb3Extension.enable");

        const isOk = await extension.metadata.provide(def);
        alert("after metadata.provide");

        if (isOk) {
          alert("trigger1");
          cacheProperties(api, connectedAccount?.wallet, injectedWeb3Extension);
          alert("trigger1");
          setTriggerCheck((v) => v + 1);
        }
      } catch (e) {
        dispatch(newErrorToast(e.message));
      }
    },
    [api, injectedWeb3Extension, connectedAccount?.wallet, dispatch],
  );

  if (!isNeedUpdate) {
    return null;
  }

  if (isWithCache) {
    return (
      <Prompt
        cacheKey={CACHE_KEY.extensionUpdateMetadata}
        type={PromptTypes.WARNING}
      >
        <PromptContent onUpdateMeta={() => updateMeta(chainInfo)} />
      </Prompt>
    );
  }

  return (
    <GreyPanel className="w-[calc(100%+50px)] right-[25px] relative rounded-none bg-orange100 text-orange500 px-6 py-4 text14Medium mb-4">
      <PromptContent onUpdateMeta={() => updateMeta(chainInfo)} />
    </GreyPanel>
  );
}
