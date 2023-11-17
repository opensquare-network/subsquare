import TextParam from "./textParam";

import { CID, digest, varint } from "multiformats";
import { isCodec } from "@polkadot/util";

import { u8aToHex } from "@polkadot/util";
import { useCallback, useMemo } from "react";

function fromIpfsCid(cid) {
  try {
    const {
      code: codec,
      multihash: { code, digest },
      version,
    } = CID.parse(cid);

    return {
      codec,
      hash: {
        code,
        digest: u8aToHex(digest),
      },
      version,
    };
  } catch (error) {
    console.error(`fromIpfsCid: ${error.message}::`, cid);

    return null;
  }
}

function toIpfsCid(cid) {
  try {
    const {
      codec,
      hash_: { code, digest: _bytes },
      version,
    } = cid;

    // Since we use parse, encode into a fully-specified bytes to
    // pass - <varint code> + <varint length> + bytes
    const bytes = _bytes.toU8a(true);
    const codeLen = varint.encodingLength(code.toNumber());
    const sizeLen = varint.encodingLength(bytes.length);
    const encoded = new Uint8Array(codeLen + sizeLen + bytes.length);

    varint.encodeTo(code.toNumber(), encoded, 0);
    varint.encodeTo(bytes.length, encoded, codeLen);
    encoded.set(bytes, codeLen + sizeLen);

    return CID.create(
      version.index,
      codec.toNumber(),
      digest.decode(encoded),
    ).toString();
  } catch (error) {
    console.error(`toIpfsCid: ${error.message}::`, cid.toHuman());

    return null;
  }
}

export default function CidParam({ value, setValue }) {
  const cid = useMemo(() => {
    if (!value) {
      return null;
    }
    isCodec(value) ? toIpfsCid(value) : null;
  }, [value]);

  const _setValue = useCallback(
    (v) => {
      if (!v) {
        setValue(undefined);
        return;
      }
      setValue(fromIpfsCid(v));
    },
    [setValue],
  );

  return (
    <TextParam
      value={cid ?? ""}
      setValue={_setValue}
      placeholder="IPFS compatible CID"
    />
  );
}
