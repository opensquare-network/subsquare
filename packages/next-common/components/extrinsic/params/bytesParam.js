import TextParam from "./textParam";

export default function BytesParam({ value, setValue }) {
  return (
    <TextParam
      value={value ?? ""}
      setValue={(v) => setValue(v ? v : undefined)}
      placeholder="0x prefixed hex, e.g. 0x1234 or ascii data"
    />
  );
}
