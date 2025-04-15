import { cn } from "next-common/utils";
import React from "react";
import { ImgSearchLight, ImgSearchDark } from "@osn/icons/subsquare";
import { useTheme } from "styled-components";

const ReminderInput = React.memo(function ReminderInput({ className = "" }) {
  const { isDark } = useTheme();
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
        <span className="h-5 text14Medium  text-center text-textTertiary">
          Search for proposals of referenda, treasury, and more
        </span>
      </p>
    </div>
  );
});

export default ReminderInput;
