import ConvictionField from "next-common/components/popup/fields/convictionField";

export default function Conviction({ conviction, setConviction }) {
  return (
    <ConvictionField conviction={conviction} setConviction={setConviction} />
  );
}
