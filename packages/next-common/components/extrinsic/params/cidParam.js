import { CID } from "multiformats";
import { u8aToHex } from "@polkadot/util";
import { useCallback } from "react";
import TextAreaInput from "next-common/components/textAreaInput";

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

export default function CidParam({ title, value, setValue }) {
  const { data } = value || {};

  const _setValue = useCallback(
    (data) => {
      if (!data) {
        setValue({
          isValid: false,
          data,
        });
        return;
      }

      const cid = fromIpfsCid(data);
      if (!cid) {
        setValue({
          isValid: false,
          data,
        });
        return;
      }

      setValue({
        isValid: true,
        data: cid,
      });
    },
    [setValue],
  );

  return (
    <>
      {title}

      <TextAreaInput
        value={data}
        setValue={_setValue}
        placeholder="IPFS compatible CID"
      />
    </>
  );
}
