import { cn } from "next-common/utils";

export default function Toggle({ disabled, isOn, onToggle, size }) {
  const small = size === "small";

  return (
    <div
      role="button"
      disabled={disabled}
      className={cn(
        "relative",
        "w-[38px] h-[22px]",
        "bg-neutral500",
        "rounded-full",
        small && "w-8 h-5",
        isOn && "bg-theme500",
        disabled && "bg-neutral300",
      )}
      onClick={() => {
        onToggle(!isOn);
      }}
    >
      <div
        className={cn(
          "w-[14px] h-[14px]",
          "absolute top-1 left-1",
          "bg-neutral100",
          "rounded-full",
          small && "w-3 h-3",
          isOn && "left-auto right-1",
        )}
      />
    </div>
  );
}
