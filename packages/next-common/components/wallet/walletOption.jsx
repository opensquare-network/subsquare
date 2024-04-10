import React from "react";
import { cn } from "next-common/utils";

/**
 * @param {React.HTMLAttributes<HTMLDivElement> & {installed: boolean, selected: boolean}} props
 */
export default function WalletOption({ selected, installed, ...props }) {
  return (
    <div
      {...props}
      className={cn(
        "flex justify-between items-center px-4 py-2.5",
        // compat with old logic
        "[&>div]:gap-x-4",
        "text14Bold text-textPrimary",
        "rounded-lg border",
        installed
          ? "cursor-pointer border-neutral400 hover:bg-neutral300 hover:border-neutral300"
          : "bg-neutral200 border-neutral200 select-none text-textTertiary", // disabled
        selected && "bg-neutral300 border-neutral300",

        // wallet logo svg
        "[&_svg]:w-[24px] [&_svg]:h-[24px]",
        "[&_span.wallet-not-installed]:text12Medium",

        props.className,
      )}
    />
  );
}
