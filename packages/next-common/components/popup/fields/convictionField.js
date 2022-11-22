import PopupLabel from "next-common/components/popup/label";
import ConvictionSelect from "next-common/components/convictionSelect";

export default function ConvictionField({
  conviction,
  setConviction,
  title = "Conviction",
  titleTooltip = "",
}) {
  return (
    <div>
      <PopupLabel text={title} titleTooltip={titleTooltip} />
      <ConvictionSelect
        value={conviction}
        setValue={setConviction}
        disabled={false}
      />
    </div>
  );
}
