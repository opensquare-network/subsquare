import { useState } from "react";
import { ArrowTriangleDown } from "@osn/icons/subsquare";
import { isNil } from "lodash-es";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import SecondaryButton from "next-common/lib/button/secondary";
import { cn } from "next-common/utils";

export default function CollapsePanel({
  children,
  labelItem,
  labelItemClassName = "",
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { width } = useWindowSize();

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  if (isNil(width)) {
    return null;
  }

  return width > 768 ? (
    <div className="flex">
      <SecondaryButton
        size="small"
        className="w-5 h-5 mx-2.5 p-0"
        onClick={toggleCollapse}
      >
        <ArrowTriangleDown
          className={cn(
            "w-3 h-3 text-textSecondary",
            isCollapsed && "rotate-180",
          )}
        />
      </SecondaryButton>

      <div
        className={cn("flex flex-col ml-[12px] w-[240px]", labelItemClassName)}
      >
        {labelItem}
        {isCollapsed && children}
      </div>
    </div>
  ) : (
    <div className={cn("flex flex-col", labelItemClassName)}>
      <div>{labelItem}</div>
      <div>{children}</div>
    </div>
  );
}
