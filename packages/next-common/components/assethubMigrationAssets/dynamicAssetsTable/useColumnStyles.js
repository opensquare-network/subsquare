import { useMemo } from "react";
import { cn } from "next-common/utils";
import { isNil } from "lodash-es";

export default function useColumnStyles(columnsDef) {
  return useMemo(() => {
    const classNames = columnsDef.map((col) =>
      cn(
        "text14Medium",
        !col.className
          ?.split(" ")
          ?.some((className) => className.startsWith("w-")) &&
          !col?.style?.width &&
          !col?.width &&
          "flex-1 w-full",
        col.className,
      ),
    );

    const styles = columnsDef.map((col) => ({
      ...col.style,
      ...(!isNil(col.width)
        ? {
            width: col.width,
            minWidth: col.width,
          }
        : {}),
    }));

    return { classNames, styles };
  }, [columnsDef]);
}
