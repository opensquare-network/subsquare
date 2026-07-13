import { hexToU8a } from "@polkadot/util";
import { CID } from "multiformats";
import { create as createDigest } from "multiformats/hashes/digest";

const SHA_256_CODE = 0x12;

export function getCidByEvidence(evidence) {
  const evidenceDigest = createDigest(SHA_256_CODE, hexToU8a(evidence));
  const cidV0 = CID.createV0(evidenceDigest);

  return cidV0.toString();
}
