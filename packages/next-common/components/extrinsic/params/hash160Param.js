import TextParam from "./textParam";

export default function Hash160Param({ title, value, setValue }) {
  return (
    <TextParam
      title={title}
      value={value}
      setValue={setValue}
      placeholder="0x prefixed hex, e.g. 0x1234 or ascii data"
    />
  );
}
