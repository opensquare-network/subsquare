import { hexToU8a } from "@polkadot/util";

const parseGov2PreImageCall = (bytes, api) => {
  const callData = api.registry.createType("Bytes", bytes);
  return api.registry.createType("Call", callData);
};

const parseDemocracyPreImageCall = (bytes, api) => {
  try {
    return api.registry.createType("Proposal", bytes);
  } catch {
    return null;
  }
};

export function parsePreImageCall(proposalHex, api) {
  try {
    return api.registry.createType("Proposal", proposalHex);
  } catch {
    const bytes = hexToU8a(proposalHex);
    try {
      return parseGov2PreImageCall(bytes, api);
    } catch {
      return parseDemocracyPreImageCall(bytes, api);
    }
  }
}
