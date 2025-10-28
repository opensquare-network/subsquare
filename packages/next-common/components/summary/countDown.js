import CountDownOrigin from "../_CountDown";
import { cn } from "next-common/utils";

const CountDown = ({ percent = 0, size = 56, width = 8 }) => {
  let percentInt = parseInt(percent);
  if (isNaN(percentInt) || percentInt < 0) {
    percentInt = 0;
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <CountDownOrigin
        size={size}
        width={width}
        numerator={percentInt}
        denominator={100}
        backgroundColor="var(--theme100)"
        foregroundColor="var(--theme500)"
      />
      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          "text-textPrimary text14Bold",
        )}
      >
        {percentInt}%
      </div>
    </div>
  );
};

export default CountDown;
