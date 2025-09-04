import { useDecisionIndex } from "next-common/utils/hooks/referenda/detail/useReferendumBlocks";
import { useMemo, useRef } from "react";

const PREPARING_THRESHOLD = 60;

export default function CustomXTickLabels({
  rangeData,
  showAyeNay = false,
  chartArea = {},
}) {
  const decisionIndex = useDecisionIndex();
  const preparingRef = useRef(null);
  const labelsLength = rangeData[1] - rangeData[0];

  const preparingwidth = useMemo(() => {
    if (rangeData[0] <= decisionIndex) {
      return (decisionIndex - rangeData[0]) / labelsLength;
    }
    return 0;
  }, [decisionIndex, labelsLength, rangeData]);

  // tick bar style
  const style = useMemo(() => {
    const { left = 0, right = 0 } = chartArea;
    return {
      paddingLeft: `${left}px`,
      paddingRight: showAyeNay ? `calc(100% - ${right}px)` : "0px",
    };
  }, [chartArea, showAyeNay]);

  //deciding ticks
  const tickLabels = useMemo(() => {
    let end = rangeData[1];
    end = end - decisionIndex;
    let start = rangeData[0];
    if (rangeData[0] <= decisionIndex) {
      start = 0;
    } else {
      start = start - decisionIndex;
    }

    const total = end - start;
    return [
      start,
      start + Math.floor(total / 3),
      start + Math.floor((total / 3) * 2),
      end - 1,
    ];
  }, [decisionIndex, rangeData]);

  return (
    <div className="w-full" style={style}>
      <div className="flex items-center w-full overflow-hidden text12Medium font-normal text-textSecondary">
        <div
          className="flex-shrink-0 overflow-hidden flex items-center justify-center border-gray400 border-l border-r"
          ref={preparingRef}
          style={{
            width: `${preparingwidth * 100}%`,
            visibility:
              preparingRef.current?.offsetWidth < PREPARING_THRESHOLD
                ? "hidden"
                : "initial",
          }}
        >
          Preparing
        </div>
        <div className="flex w-full justify-between">
          {tickLabels.map((label, idx) => (
            <div key={idx}>{label}hs</div>
          ))}
        </div>
      </div>
    </div>
  );
}
