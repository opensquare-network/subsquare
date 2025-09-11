import { cn } from "next-common/utils";

export default function Toggle({ disabled, isOn, onToggle, size }) {
  const small = size === "small";

  return (
    <div
      role="button"
      disabled={disabled}
      className={cn(
        "relative flex items-center",
        "w-10 h-6",
        "bg-neutral500",
        "rounded-full",
        "transition-colors duration-200",
        small && "w-7 h-4",
        isOn && "bg-theme500 justify-end",
        !isOn && "justify-start",
        disabled && "bg-neutral300",
      )}
      onClick={() => {
        onToggle(!isOn);
      }}
    >
      <div
        className={cn(
          "w-4 h-4",
          "bg-neutral100",
          "rounded-full",
          "mx-1",
          "transition-all duration-200",
          small && "w-3 h-3 mx-[2px]",
        )}
      />
    </div>
  );
}
