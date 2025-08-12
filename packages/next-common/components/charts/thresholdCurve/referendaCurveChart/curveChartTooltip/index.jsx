import * as RadixTooltip from "@radix-ui/react-tooltip";
import { cn } from "next-common/utils";
import { useMemo } from "react";

export default function CurveChartTooltip({
  visible,
  position,
  data,
  container = document.body,
}) {
  const { left = 0, top = 0 } = useMemo(
    () => container?.getBoundingClientRect() || {},
    [container],
  );

  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root
        open={visible}
        style={{
          position: "absolute",
        }}
      >
        <RadixTooltip.Portal container={container || document.body}>
          <RadixTooltip.Content
            className={cn(
              "z-[1000000] rounded py-1.5 px-1.5",
              "text12Normal text-textPrimaryContrast",
              "bg-tooltipBg",
              "[&_.value-display-symbol]:text-inherit pointer-events-none transition-all",
            )}
            style={{
              position: "absolute",
              left: left + position?.x,
              top: top + position?.y,
              transform:
                position?.side === "left"
                  ? "translate(6px,-50%)"
                  : "translate(calc(-100% - 6px),-50%)",
            }}
            asChild
          >
            <div className="w-auto p-2">
              <div>
                <div className="text12Bold pb-1 whitespace-nowrap">
                  {data?.title}
                </div>
                <div className=" text12Normal space-y-0.5">
                  {data?.data?.map(({ label, value }) => (
                    <div className="flex whitespace-nowrap" key={label}>
                      <div className="">{label} :</div>
                      <div className="pl-1">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className={cn(
                  "absolute right-full top-1/2 transform -translate-y-1/2",
                  position?.side === "right"
                    ? "transform rotate-180 translate-x-full right-0"
                    : "",
                )}
              >
                <div className="w-0 h-0 border-t-[5px] border-b-[5px] border-r-[5px] border-t-transparent border-b-transparent border-r-tooltipBg"></div>
              </div>
            </div>
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
