import { cn } from "next-common/utils";
import React from "react";
import { ImgSearchLight, ImgSearchDark } from "@osn/icons/subsquare";
import { useTheme } from "styled-components";
import useInsideSearchSupportCategories from "next-common/components/header/hooks/useInsideSearchSupportCategories";

const ReminderInput = React.memo(function ReminderInput({
  className = "",
  isMobile,
}) {
  const { isDark } = useTheme();
  const { categoryString } = useInsideSearchSupportCategories();
  return (
    <div
      className={cn(
        "w-full",
        "h-[584px]",
        "rounded-lg",
        "flex",
        "justify-center",
        "items-center",
        className,
        isMobile ? "h-[calc(80vh-56px)]" : "",
      )}
    >
      <p className="flex flex-col items-center pb-4">
        {isDark ? (
          <ImgSearchDark className="w-30 h-20" />
        ) : (
          <ImgSearchLight className="w-30 h-20" />
        )}

        <span className="mt-2 font-bold h-5 text14Medium text-center text-textPrimary">
          Type your search item in the box
        </span>
        <span className="px-2 h-5 text14Medium  text-center text-textTertiary">
          {`Search ${categoryString} on SubSquare`}
        </span>
      </p>
    </div>
  );
});

export default ReminderInput;
