import { hexToU8a } from "@polkadot/util";
import { CID } from "multiformats";
import { create as createDigest } from "multiformats/hashes/digest";

const SHA_256_CODE = 0x12;

export function getCidByEvidence(evidence) {
  return CID.createV0(createDigest(SHA_256_CODE, hexToU8a(evidence)))
    .toV1()
    .toString();
}
