import Prompt from "./prompt";
import { PromptTypes } from "next-common/components/scrollPrompt";
import {
  useConnectedAccount,
  useIsWatchOnly,
} from "next-common/context/connectedAccount";
import { useInjectedWeb3Extension } from "next-common/hooks/connect/useInjectedWeb3Extension";
import { CACHE_KEY } from "next-common/utils/constants";
import { useCallback, useEffect, useState } from "react";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { createGlobalState } from "react-use";
import safeLocalStorage from "next-common/utils/safeLocalStorage";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import {
  findExtensionMetadata,
  isMetadataStored,
  isProvideRecent,
  needMetadataUpdate,
} from "./extensionUpdateUtils";
import { buildMetadataDef } from "./metadataDef";

const useCheckResult = createGlobalState("ok");

function getPropertyStoreKey(genesisHash) {
  return `properties:${genesisHash.toHex()}`;
}

function getProvidedStoreKey(genesisHash) {
  return `metadataProvided:${genesisHash.toHex()}`;
}

function getProvidedRecord(api) {
  try {
    const data = safeLocalStorage.getItem(getProvidedStoreKey(api.genesisHash));
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function setProvidedRecord(api, specVersion) {
  safeLocalStorage.setItem(
    getProvidedStoreKey(api.genesisHash),
    JSON.stringify({ specVersion, at: Date.now() }),
  );
}

function getAllCachedProperties(api) {
  const storeKey = getPropertyStoreKey(api.genesisHash);
  let allProperties = {};
  try {
    const data = safeLocalStorage.getItem(storeKey);
    if (data) {
      allProperties = JSON.parse(data);
    }
  } catch {
    // Ignore
  }
  return allProperties;
}

function getCachedProperties(api, walletName) {
  let allProperties = getAllCachedProperties(api);
  return allProperties[walletName];
}

function cacheProperties(api, name, { version }) {
  if (!name) {
    return;
  }

  let allProperties = getAllCachedProperties(api);

  allProperties[name] = {
    extensionVersion: version,
    ss58Format: api.registry.chainSS58,
    tokenDecimals: api.registry.chainDecimals[0],
    tokenSymbol: api.registry.chainTokens[0],
  };

  const storeKey = getPropertyStoreKey(api.genesisHash);
  safeLocalStorage.setItem(storeKey, JSON.stringify(allProperties));
}

// The injected extension object carries no name, so the cached entry is keyed by the same
// wallet name that cacheProperties() writes.
function checkPropertiesChange(api, walletName) {
  if (!walletName) {
    return false;
  }

  const property = getCachedProperties(api, walletName);
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

function UpdateAction({ onClick, disabled }) {
  return (
    <span
      role="button"
      className={
        disabled
          ? "cursor-not-allowed underline opacity-50"
          : "cursor-pointer underline"
      }
      onClick={disabled ? undefined : onClick}
    >
      Update
    </span>
  );
}

function PromptContent({ onUpdateMeta, status }) {
  const disabled = status === "updating";

  if (status === "missing") {
    return (
      <div>
        Your wallet no longer holds the metadata for this chain.&nbsp;
        <UpdateAction onClick={onUpdateMeta} disabled={disabled} /> to add it
        again.
      </div>
    );
  }

  if (status === "not-saved") {
    return (
      <div>
        The extension did not accept the latest chain metadata. Make sure it is
        unlocked, then&nbsp;
        <UpdateAction onClick={onUpdateMeta} disabled={disabled} /> again.
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div>
        Updating the extension metadata failed.&nbsp;
        <UpdateAction onClick={onUpdateMeta} disabled={disabled} /> to try
        again.
      </div>
    );
  }

  return (
    <div>
      The extension can be updated with the latest chain metadata and
      properties.&nbsp;
      <UpdateAction onClick={onUpdateMeta} disabled={disabled} />
    </div>
  );
}

export default function ExtensionUpdatePrompt({ isWithCache = true }) {
  const api = useContextApi();
  const isWatchOnly = useIsWatchOnly();
  const connectedAccount = useConnectedAccount();
  const connectedAccountWallet = connectedAccount?.wallet;
  const { decimals, ss58Format } = useChainSettings();
  const [checkResult, setCheckResult] = useCheckResult();
  const { injectedWeb3Extension, loading: isLoadingInjectedWeb3Extension } =
    useInjectedWeb3Extension(connectedAccountWallet);
  const [triggerCheck, setTriggerCheck] = useState(0);
  const [status, setStatus] = useState(null);

  const checkNeedUpdate = useCallback(
    async (api, extension) => {
      if (!api || !extension?.metadata?.get) {
        return "ok";
      }

      const known = await extension.metadata.get();
      const current = findExtensionMetadata(known, (genesisHash) =>
        api.genesisHash.eq(genesisHash),
      );
      const onchainSpecVersion = api.runtimeVersion.specVersion.toNumber();

      const isOutdated = needMetadataUpdate({
        hasExtensionMetadata: Boolean(current),
        extensionSpecVersion: current?.specVersion,
        onchainSpecVersion,
        propertiesChanged: checkPropertiesChange(api, connectedAccountWallet),
      });

      if (!isOutdated) {
        return "ok";
      }

      const record = getProvidedRecord(api);

      // A wallet that fails to persist the definition asks again on every popup, so the
      // same chain version is only retried once a day. isProvideRecent also lets a real
      // runtime upgrade through, because it bumps the onchain version.
      if (isProvideRecent(record, onchainSpecVersion)) {
        return "ok";
      }

      // Nothing was ever provided for this chain, so the wallet is simply new to it.
      if (!record) {
        return "outdated";
      }

      // We handed this chain's metadata to the wallet earlier and the entry is gone.
      return current ? "outdated" : "missing";
    },
    [connectedAccountWallet],
  );

  useEffect(() => {
    if (!api || isLoadingInjectedWeb3Extension || !injectedWeb3Extension) {
      return;
    }

    injectedWeb3Extension
      .enable("subsquare")
      .then((extension) => checkNeedUpdate(api, extension))
      .then((result) => setCheckResult(result))
      .catch((e) => {
        console.error(e);
        setCheckResult("ok");
      });
  }, [
    api,
    checkNeedUpdate,
    injectedWeb3Extension,
    isLoadingInjectedWeb3Extension,
    triggerCheck,
    setCheckResult,
  ]);

  const updateMeta = useCallback(async () => {
    if (!api || !injectedWeb3Extension) {
      return;
    }

    setStatus("updating");

    try {
      const extension = await injectedWeb3Extension.enable("subsquare");
      if (!extension?.metadata?.provide) {
        setStatus("failed");
        return;
      }

      // Built at click time: a definition captured on page load can carry the metadata
      // of the runtime before an upgrade and would overwrite a newer stored one.
      const def = await buildMetadataDef(api, { decimals, ss58Format });
      const provided = await extension.metadata.provide(def);
      if (!provided) {
        setStatus("failed");
        return;
      }

      cacheProperties(api, connectedAccountWallet, injectedWeb3Extension);
      setProvidedRecord(api, def.specVersion);

      const known = await extension.metadata.get();
      const stored = isMetadataStored(
        known,
        (genesisHash) => api.genesisHash.eq(genesisHash),
        def.specVersion,
      );
      setStatus(stored ? null : "not-saved");
      setTriggerCheck((v) => v + 1);
    } catch (e) {
      console.error(e);
      setStatus("failed");
    }
  }, [
    api,
    injectedWeb3Extension,
    connectedAccountWallet,
    decimals,
    ss58Format,
  ]);

  const hasFailure = status === "failed" || status === "not-saved";
  const isNeedUpdate = checkResult !== "ok";

  if (isWatchOnly || (!isNeedUpdate && !hasFailure)) {
    return null;
  }

  const content = (
    <PromptContent
      onUpdateMeta={updateMeta}
      status={status || (checkResult === "missing" ? "missing" : null)}
    />
  );

  if (isWithCache) {
    return (
      <Prompt
        cacheKey={CACHE_KEY.extensionUpdateMetadata}
        type={PromptTypes.WARNING}
      >
        {content}
      </Prompt>
    );
  }

  return (
    <GreyPanel className="w-[calc(100%+50px)] right-[25px] relative rounded-none bg-orange100 text-orange500 px-6 py-4 text14Medium">
      {content}
    </GreyPanel>
  );
}
