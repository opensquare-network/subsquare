import Extrinsic from "..";

export default function CallParam({ title, value, setValue }) {
  return (
    <>
      {title}
      <Extrinsic value={value} setValue={setValue} />
    </>
  );
}
