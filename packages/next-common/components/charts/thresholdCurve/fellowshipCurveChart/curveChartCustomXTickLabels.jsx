import { useMemo } from "react";

export default function CustomXTickLabels({
  rangeData,
  showAyeNay = false,
  chartArea = {},
}) {
  const style = useMemo(() => {
    const { left = 0, right = 0 } = chartArea;
    return {
      paddingLeft: `${left}px`,
      paddingRight: showAyeNay ? `calc(100% - ${right}px)` : "0px",
    };
  }, [chartArea, showAyeNay]);

  const tickLabels = useMemo(() => {
    let end = rangeData[1];
    let start = rangeData[0];
    const total = end - start;
    return [
      start,
      start + Math.floor(total / 3),
      start + Math.floor((total / 3) * 2),
      end - 1,
    ];
  }, [rangeData]);

  return (
    <div className="w-full" style={style}>
      <div className="flex items-center w-full overflow-hidden text12Medium font-normal text-textSecondary">
        <div className="flex w-full justify-between">
          {tickLabels.map((label, idx) => (
            <div key={idx}>{label}hs</div>
          ))}
        </div>
      </div>
    </div>
  );
}
