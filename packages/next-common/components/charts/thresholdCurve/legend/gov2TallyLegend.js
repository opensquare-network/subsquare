import LegendItem from "../../legend/item";

export default function ThresholdCurvesGov2TallyLegend({ isFellowship }) {
  return (
    <div className="flex justify-center flex-wrap">
      <LegendItem color="var(--purple500)">Support</LegendItem>
      <LegendItem dashed color="var(--purple500)">
        Current Support
      </LegendItem>
      <LegendItem color="var(--green500)">Approval</LegendItem>
      <LegendItem dashed color="var(--green500)">
        Current Approval
      </LegendItem>

      {!isFellowship && (
        <>
          <LegendItem square color="var(--green300)">
            Aye
          </LegendItem>
          <LegendItem square color="var(--red300)">
            Nay
          </LegendItem>
        </>
      )}
    </div>
  );
}
