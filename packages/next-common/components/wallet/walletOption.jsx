import React from "react";
import { cn } from "next-common/utils";
import Loading from "../loading";

/**
 * @param {{
 *  selected: boolean
 *  installed: boolean
 *  logo: React.ReactElement
 *  title: string
 *  loading?: boolean
 *  notInstalledContent?: React.ReactElement
 *  extraContent?: React.ReactElement
 * } & React.HTMLAttributes<HTMLDivElement>} props
 */
export default function WalletOption({
  selected,
  installed,
  logo,
  title,
  loading,
  notInstalledContent,
  extraContent: extraContentProp,
  ...props
}) {
  let extraContent;
  if (loading) {
    extraContent = <Loading />;
  } else if (!installed) {
    extraContent = notInstalledContent || (
      <div className="text12Medium">Not installed</div>
    );
  } else {
    extraContent = extraContentProp;
  }

  const disabled = !installed || loading;

  return (
    <div
      role="button"
      {...props}
      className={cn(
        "flex justify-between items-center px-4 py-2.5",
        // compat with old logic
        "[&>div]:gap-x-4",
        "text14Bold text-textPrimary",
        "rounded-lg border",

        !disabled
          ? "border-neutral400 hover:bg-neutral300 hover:border-neutral300"
          : "cursor-default bg-neutral200 border-neutral200 select-none text-textTertiary", // disabled
        selected && "bg-neutral300 border-neutral300",

        // wallet logo svg
        "[&_svg]:w-[24px] [&_svg]:h-[24px]",

        props.className,
      )}
    >
      <div className="flex items-center">
        {logo}
        <div>{title}</div>
      </div>

      {extraContent}
    </div>
  );
}
