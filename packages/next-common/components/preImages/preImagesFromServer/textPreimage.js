import { Binary } from "polkadot-api";
import { hexToString } from "viem";
import { hexIsValidUTF8 } from "next-common/utils/utf8validate";

function unwrapPreimageBytes(bytes) {
  try {
    return Binary.fromOpaque(bytes);
  } catch {
    return bytes;
  }
}

export function getTextPreimage(bytes) {
  const rawBytes = unwrapPreimageBytes(bytes);
  const hex = Binary.toHex(rawBytes);

  if (!hexIsValidUTF8(hex)) {
    return null;
  }

  return hexToString(hex);
}
