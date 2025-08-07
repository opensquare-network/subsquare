import { debounce, merge } from "lodash-es";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { cn } from "next-common/utils";
import { useMemo } from "react";

export default function CustomChartTooltip({
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
              "[&_.value-display-symbol]:text-inherit pointer-events-none",
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
                <div className="text12Bold pb-1  whitespace-nowrap">
                  {data?.title}
                </div>
                <div className=" text12Normal space-y-0.5">
                  {data?.afterBody?.map((i) => (
                    <div key={i}>{i}</div>
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

export const getCustomTooltip = (options, setTooltip) => {
  const setData = debounce(setTooltip, 100);
  return merge(options, {
    plugins: {
      tooltip: {
        enabled: false,
        external: (context) => {
          const { chart, tooltip } = context;
          if (tooltip.opacity === 0) {
            setData({ ...tooltip, visible: false });
            return;
          }

          setData({
            visible: true,
            position: {
              x: chart.canvas.offsetLeft + tooltip.caretX,
              y: chart.canvas.offsetTop + tooltip.caretY,
              side: tooltip.xAlign,
              align: tooltip.yAlign,
            },
            data: {
              title: tooltip.title.join(""),
              value: tooltip.body.map((b) => b.lines.join("")).join(""),
              afterBody: tooltip.afterBody,
            },
          });
        },
      },
    },
  });
};
