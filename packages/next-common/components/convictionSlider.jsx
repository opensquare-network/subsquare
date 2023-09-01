import clsx from "clsx";
import ReactSlider from "react-slider";
import ThumbSvg from "./slider/thumb.svg";
import { convictionToLockX } from "next-common/utils/referendumCommon";
import last from "lodash.last";

const DEFAULT_OPTIONS = [
  {
    label: "0.1x, no lockup period",
    value: 0,
  },
  {
    label: "1x, locked for 1 enactment period(s)",
    value: 1,
  },
  {
    label: "2x, locked for 2 enactment period(s)",
    value: 2,
  },
  {
    label: "3x, locked for 4 enactment period(s)",
    value: 3,
  },
  {
    label: "4x, locked for 8 enactment period(s)",
    value: 4,
  },
  {
    label: "5x, locked for 16 enactment period(s)",
    value: 5,
  },
  {
    label: "6x, locked for 32 enactment period(s)",
    value: 6,
  },
];

export default function ConvictionSlider({
  value,
  setValue,
  disabled,
  options = DEFAULT_OPTIONS,
}) {
  return (
    <ReactSlider
      className="cursor-grab h-12"
      onChange={(val) => {
        setValue(val);
      }}
      disabled={disabled}
      marks
      min={0}
      max={last(options)?.value}
      // slider button
      renderThumb={(props) => (
        <div
          {...props}
          className={clsx(
            props.className,
            "top-6",
            "flex items-center justify-center",
            "w-6 h-6",
            "bg-neutral100 border border-neutral300 rounded shadow-100 outline-theme500",
          )}
        >
          <ThumbSvg />
        </div>
      )}
      // slider dot
      renderMark={(props) => (
        <div {...props} className={clsx(props.className, "flex flex-col")}>
          <div className="text12Medium text-textSecondary mb-2 text-center">
            {convictionToLockX(props.key)}
          </div>
          <div className="w-6 h-6 flex items-center justify-center">
            <span
              className={clsx(
                "inline-block w-2 h-3 rounded-sm bg-neutral200",
                value > props.key && "bg-theme500",
              )}
            />
          </div>
        </div>
      )}
      // slider background
      renderTrack={(props, state) => (
        <div
          {...props}
          className={clsx(
            props.className,
            "h-1.5 bg-neutral400",
            state.index === 0 && "bg-theme300",
          )}
          style={{
            ...props.style,
            left: props.style.left + 12,
            right: props.style.right + 12,
            top: 33,
          }}
        />
      )}
    />
  );
}
