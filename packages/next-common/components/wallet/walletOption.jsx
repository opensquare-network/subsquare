import React from "react";
import clsx from "clsx";

/**
 * @param {React.HTMLAttributes<HTMLDivElement> & {installed: boolean, selected: boolean}} props
 */
export default function WalletOption(props) {
  return (
    <div
      {...props}
      className={clsx(
        "flex justify-between items-center px-4 py-2.5",
        "[&>div]:gap-x-4",
        "text14Bold text-textPrimary",
        "rounded-lg border",
        // disabled
        props.installed
          ? "cursor-pointer hover:bg-neutral300 hover:border-neutral300"
          : "bg-neutral200 border-neutral200 cursor-not-allowed pointer-events-none select-none text-textTertiary",
        props.selected && "bg-neutral300 border-neutral300",

        "[&_span.wallet-not-installed]:text12Medium",

        props.className,
      )}
    />
  );
}
