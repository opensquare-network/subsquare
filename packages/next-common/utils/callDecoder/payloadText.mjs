import isUtf8 from "is-utf8";

// Preimages are used for more than calls: a payload may just be a text note.
// Such a payload can not be a SCALE encoded call, and handing it to the call
// codecs is expensive, so it is recognized by its bytes alone.
export function isPrintableTextPayload(bytes) {
  if (!bytes?.length) {
    return false;
  }

  if (!isUtf8(Buffer.from(bytes))) {
    return false;
  }

  for (const byte of bytes) {
    const isPrintable = byte >= 0x20 && byte !== 0x7f;
    const isWhitespace = byte === 0x09 || byte === 0x0a || byte === 0x0d;
    if (!isPrintable && !isWhitespace) {
      return false;
    }
  }

  return true;
}
