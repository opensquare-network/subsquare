import { getSpecTypes } from "@polkadot/types-known";
import { formatBalance, isNumber } from "@polkadot/util";
import { base64Encode } from "@polkadot/util-crypto";

// The extension stores whatever definition it is handed and answers later checks with the
// spec version from it, so specVersion and metaCalls must describe the same runtime.
// api.runtimeMetadata is refetched asynchronously after an upgrade, so the version is read
// from the metadata itself (System.Version) and only falls back to the runtime version.
function metadataSpecVersion(api, fallback) {
  try {
    return api.consts.system.version.specVersion.toNumber();
  } catch {
    return fallback;
  }
}

export async function buildMetadataDef(api, { decimals, ss58Format }) {
  const chain = (await api.rpc.system.chain()).toString();
  const metaCalls = base64Encode(api.runtimeMetadata.asCallsOnly.toU8a());
  const specVersion = metadataSpecVersion(
    api,
    api.runtimeVersion.specVersion.toNumber(),
  );

  const defaultDecimals = api.registry.createType("u32", decimals).toNumber();
  const defaultSs58 = api.registry.createType("u32", ss58Format).toNumber();

  return {
    chain,
    chainType: api.registry.chainIsEthereum ? "ethereum" : "substrate",
    genesisHash: api.genesisHash.toHex(),
    icon: "polkadot",
    metaCalls,
    specVersion,
    ss58Format: isNumber(api.registry.chainSS58)
      ? api.registry.chainSS58
      : defaultSs58,
    tokenDecimals: (api.registry.chainDecimals || [defaultDecimals])[0],
    tokenSymbol: (api.registry.chainTokens ||
      formatBalance.getDefaults().unit)[0],
    types: getSpecTypes(
      api.registry,
      chain,
      api.runtimeVersion.specName,
      specVersion,
    ),
  };
}
