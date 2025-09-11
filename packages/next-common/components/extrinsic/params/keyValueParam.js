import { useCallback, useEffect, useState } from "react";
import TextParam from "./textParam";
import { compactAddLength, hexToU8a, u8aConcat } from "@polkadot/util";

export function createParam(hex) {
  let u8a;

  try {
    u8a = hexToU8a(hex.toString());
  } catch {
    u8a = new Uint8Array([]);
  }

  return compactAddLength(u8a);
}

export default function KeyValueParam({ title, setValue }) {
  const [data, setData] = useState({
    key: "",
    value: "",
  });

  const onChangeKey = useCallback(
    (key) => setData(({ value }) => ({ key, value })),
    [],
  );

  const onChangeValue = useCallback(
    (value) => setData(({ key }) => ({ key, value })),
    [],
  );

  useEffect(() => {
    const key = createParam(data.key);
    const value = createParam(data.value);
    setValue(u8aConcat(key, value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <>
      {title}
      <div className="flex flex-col gap-[8px]">
        <div className="flex flex-col gap-[8px]">
          <span className="text12Bold whitespace-nowrap">key: [u8]</span>
          <TextParam
            value={data.key ?? ""}
            setValue={onChangeKey}
            placeholder="0x..."
          />
        </div>
        <div className="flex flex-col gap-[8px]">
          <span className="text12Bold whitespace-nowrap">value: [u8]</span>
          <TextParam
            value={data.value ?? ""}
            setValue={onChangeValue}
            placeholder="0x..."
          />
        </div>
      </div>
    </>
  );
}
