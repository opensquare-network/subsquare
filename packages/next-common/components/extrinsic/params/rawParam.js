import TextParam from "./textParam";

export default function RawParam({ title, value, setValue }) {
  return (
    <TextParam
      title={title}
      value={value}
      setValue={setValue}
      placeholder="Hex data"
    />
  );
}
