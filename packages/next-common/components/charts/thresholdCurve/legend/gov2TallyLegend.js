import LegendItem from "../../legend/item";

export default function ThresholdCurvesGov2TallyLegend() {
  return (
    <div className="flex justify-center">
      <LegendItem dashed color="var(--green500)">
        Approval
      </LegendItem>
      <LegendItem color="var(--green500)">Current Approval</LegendItem>
      <LegendItem dashed color="var(--purple500)">
        Support
      </LegendItem>
      <LegendItem color="var(--purple500)">Current Support</LegendItem>
    </div>
  );
}
