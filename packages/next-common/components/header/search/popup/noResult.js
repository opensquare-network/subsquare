import { cn } from "next-common/utils";
import React from "react";
import { ImgNoResultsLight, ImgNoResultsDark } from "@osn/icons/subsquare";
import { useTheme } from "styled-components";

const NoResut = React.memo(function NoResut({ className = "" }) {
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
          <ImgNoResultsDark className="w-30 h-20" />
        ) : (
          <ImgNoResultsLight className="w-30 h-20" />
        )}

        <span className="mt-2 font-bold h-5 text14Medium text-center text-textPrimary">
          No Results Found
        </span>
      </p>
    </div>
  );
});

export default NoResut;
