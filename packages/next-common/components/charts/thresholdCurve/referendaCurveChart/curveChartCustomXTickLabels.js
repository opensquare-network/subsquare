import { useDecisionIndex } from "next-common/utils/hooks/referenda/detail/useReferendumBlocks";
import { useMemo, useRef } from "react";

const PREPARING_THRESHOLD = 60;

export default function CustomXTickLabels({
  labelsLength = 0,
  showAyeNay = false,
  chartArea = {},
}) {
  const decisionIndex = useDecisionIndex();
  const preparingRef = useRef(null);

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
    return [
      0,
      Math.floor((labelsLength - decisionIndex) / 3),
      Math.floor(((labelsLength - decisionIndex) / 3) * 2),
      labelsLength - decisionIndex - 1,
    ];
  }, [labelsLength, decisionIndex]);

  return (
    <div className="w-full" style={style}>
      <div className="flex items-center w-full overflow-hidden text12Medium font-normal text-textSecondary">
        <div
          className="flex-shrink-0 overflow-hidden flex items-center justify-center border-gray400 border-l border-r"
          ref={preparingRef}
          style={{
            width: `${(decisionIndex / labelsLength) * 100}%`,
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
