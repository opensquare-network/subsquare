import { cn } from "next-common/utils";

export function OptionsWrapper({ itemHeight, maxDisplayItem, ...props }) {
  return (
    <div
      {...props}
      className={cn(
        "z-[999999]",
        "absolute -left-px right-0 top-[calc(100%+4px)]",
        "bg-neutral100 shadow-200",
        "rounded py-2 px-0",
        "w-[calc(100%+2px)]",
        "text-textPrimary",
        "dark:border dark:border-neutral300",
        maxDisplayItem && "scrollbar-pretty overflow-y-scroll",
      )}
      style={{
        maxHeight: maxDisplayItem && itemHeight * maxDisplayItem,
        ...props.style,
      }}
    />
  );
}
