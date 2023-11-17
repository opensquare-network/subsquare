import noop from "lodash.noop";
import { cn } from "next-common/utils";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { hexToU8a, isHex, u8aToString } from "@polkadot/util";

const BYTE_STR_0 = "0".charCodeAt(0);
const BYTE_STR_X = "x".charCodeAt(0);
const STR_NL = "\n";

function convertResult(result) {
  const data = new Uint8Array(result);

  // this converts the input (if detected as hex), via the hex conversion route
  if (data[0] === BYTE_STR_0 && data[1] === BYTE_STR_X) {
    let hex = u8aToString(data);

    while (hex.endsWith(STR_NL)) {
      hex = hex.substring(0, hex.length - 1);
    }

    if (isHex(hex)) {
      return hexToU8a(hex);
    }
  }

  return data;
}

export default function FileParam({ children, accept, file, setFile }) {
  const onDrop = useCallback(
    (files) => {
      files.forEach((file) => {
        const reader = new FileReader();

        reader.onabort = noop;
        reader.onerror = noop;

        reader.onload = ({ target }) => {
          if (target?.result) {
            const name = file.name;
            const data = convertResult(target.result);

            setFile({
              name,
              data,
            });
          }
        };

        reader.readAsArrayBuffer(file);
      });
    },
    [setFile],
  );

  const { getInputProps, getRootProps } = useDropzone({
    accept: accept?.reduce((all, mime) => ({ ...all, [mime]: [] }), {}),
    disabled: false,
    onDrop,
  });

  return (
    <div
      {...getRootProps({
        className: cn(
          "flex",
          "cursor-pointer",
          "overflow-hidden",
          "border border-neutral400 rounded-lg",
          "leading-none",
        ),
      })}
    >
      <input {...getInputProps()} />
      {file ? (
        children(file)
      ) : (
        <span className="px-[16px] py-[8px] text14Medium text-textDisabled italic">
          click to select or drag and drop the file here
        </span>
      )}
    </div>
  );
}
