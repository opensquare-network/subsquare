import TextParam from "./textParam";

import { CID, digest, varint } from "multiformats";

import { u8aToHex } from "@polkadot/util";
import { useEffect, useMemo, useState } from "react";

function fromIpfsCid(cid) {
  try {
    const {
      code: codec,
      multihash: { code, digest },
      version,
    } = CID.parse(cid);

    return {
      codec,
      hash_: {
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

    const bytes = Buffer.from(_bytes.replace(/^0x/, ""), "hex");
    const codeLen = varint.encodingLength(code);
    const sizeLen = varint.encodingLength(bytes.length);
    const encoded = new Uint8Array(codeLen + sizeLen + bytes.length);

    varint.encodeTo(code, encoded, 0);
    varint.encodeTo(bytes.length, encoded, codeLen);
    encoded.set(bytes, codeLen + sizeLen);

    return CID.create(version, codec, digest.decode(encoded)).toString();
  } catch (error) {
    console.error(`toIpfsCid: ${error.message}::`, cid);

    return null;
  }
}

export default function CidParam({ value, setValue }) {
  const [inputCid, setInputCid] = useState("");
  const cid = useMemo(() => toIpfsCid(value), [value]);
  console.log(cid, "===", inputCid);

  useEffect(() => {
    if (!inputCid) {
      setValue(undefined);
      return;
    }
    setValue(fromIpfsCid(inputCid));
  }, [inputCid]);

  return (
    <TextParam
      value={inputCid}
      setValue={setInputCid}
      placeholder="IPFS compatible CID"
    />
  );
}
