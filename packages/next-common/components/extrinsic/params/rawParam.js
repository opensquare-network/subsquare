import TextParam from "./textParam";

export default function RawParam({ value, setValue }) {
  return <TextParam value={value} setValue={setValue} placeholder="Hex data" />;
}
