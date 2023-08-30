import clsx from "clsx";
import LegendItem from "../../legend/item";

export default function ThresholdCurvesGov2TrackSummaryLegend({
  className = "",
}) {
  return (
    <div className={clsx("flex", className)}>
      <LegendItem color="var(--green500)">Approval</LegendItem>
      <LegendItem color="var(--purple500)">Support</LegendItem>
    </div>
  );
}
