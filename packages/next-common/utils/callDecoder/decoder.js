import {
  getDynamicBuilder,
  getLookupFn,
} from "@polkadot-api/metadata-builders";
import {
  metadata as metadataCodec,
  unifyMetadata,
} from "@polkadot-api/substrate-bindings";
import { toTypedCallTree } from "./treeBuilder";
import { normalizeCallTree } from "./treeNormalize";

export async function getMetadata(client) {
  const metadataRaw = await client._request("state_getMetadata", []);
  return unifyMetadata(metadataCodec.dec(metadataRaw));
}

export async function getBlockMetadata(client, blockHash) {
  const metadataRaw = await client._request("state_getMetadata", [blockHash]);
  return unifyMetadata(metadataCodec.dec(metadataRaw));
}

export function decodeCallTree(bytes, metadata) {
  const lookup = getLookupFn(metadata);
  const dynamicBuilder = getDynamicBuilder(lookup);

  const codecType = lookup.call;
  if (!codecType) {
    throw new Error("Can't find call type definition in metadata");
  }

  const callCodec = dynamicBuilder.buildDefinition(codecType);
  const decodedCall = callCodec.dec(bytes);

  const tree = toTypedCallTree(decodedCall, lookup, codecType, null, metadata);

  return normalizeCallTree(tree);
}
