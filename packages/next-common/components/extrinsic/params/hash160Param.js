import TextParam from "./textParam";

export default function Hash160Param({ value, setValue }) {
  return (
    <TextParam
      value={value}
      setValue={setValue}
      placeholder="0x prefixed hex, e.g. 0x1234 or ascii data"
    />
  );
}
