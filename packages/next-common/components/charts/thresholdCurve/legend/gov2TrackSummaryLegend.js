import { cn } from "next-common/utils";
import LegendItem from "../../legend/item";

export default function ThresholdCurvesGov2TrackSummaryLegend({
  className = "",
}) {
  return (
    <div className={cn("flex", className)}>
      <LegendItem color="var(--green500)">Approval</LegendItem>
      <LegendItem color="var(--purple500)">Support</LegendItem>
    </div>
  );
}
