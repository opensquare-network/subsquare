import { useMemo } from "react";

export default function CustomXTickLabels({
  decisionIndex,
  labelsLength,
  showAyeNay,
  chartArea,
}) {
  const style = useMemo(() => {
    const { width = 0, left = 0, right = 0 } = chartArea || {};
    return {
      paddingLeft: left + "px",
      paddingRight: showAyeNay ? right - width : 2 + "px",
    };
  }, [chartArea, showAyeNay]);

  return (
    <div className="w-full" style={style}>
      <div className="flex items-center w-full overflow-hidden text12Medium font-normal text-textSecondary">
        {decisionIndex > 80 ? (
          <div
            className="flex-shrink-0"
            style={{
              width: (decisionIndex / labelsLength) * 100 + "%",
            }}
          >
            Preparing
          </div>
        ) : null}
        <div className="flex flex-wrap w-full justify-between ">
          <div className="flex w-full justify-between">
            <div className="">0hs</div>
            <div className=" ">
              {Math.floor((labelsLength - decisionIndex) / 3)}hs
            </div>
            <div className=" ">
              {Math.floor(((labelsLength - decisionIndex) / 3) * 2)}hs
            </div>
            <div className=" ">{labelsLength - decisionIndex - 1}hs</div>
          </div>
        </div>
      </div>
    </div>
  );
}
