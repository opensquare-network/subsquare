import TextParam from "./textParam";

export default function RawParam({ value, setValue }) {
  return (
    <TextParam
      value={value ?? ""}
      setValue={(v) => setValue(v ? v : undefined)}
      placeholder="Hex data"
    />
  );
}
