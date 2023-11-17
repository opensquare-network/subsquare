import TextParam from "./textParam";

export default function AccountId32Param({ value, setValue }) {
  return (
    <TextParam
      value={value ?? ""}
      setValue={setValue}
      placeholder="0x0000000000000000000000000000000000000000000000000000000000000000"
    />
  );
}
