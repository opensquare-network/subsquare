import TextParam from "./textParam";

export default function AccountId20Param({ title, value, setValue }) {
  return (
    <TextParam
      title={title}
      value={value}
      setValue={setValue}
      placeholder="0x0000000000000000000000000000000000000000"
    />
  );
}
