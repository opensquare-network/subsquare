import React from "react";
import { cn } from "next-common/utils";
import SecondaryButton from "next-common/lib/button/secondary";
import ExternalLink from "../externalLink";
import { SystemLink, SystemLoadingDots } from "@osn/icons/subsquare";

/**
 * @param {{
 *  selected: boolean
 *  installed: boolean
 *  installUrl?: string
 *  logo: React.ReactElement
 *  title: string
 * } & ButtonProps} props
 */
export default function WalletOption({
  selected,
  installed,
  installUrl,
  logo,
  title,
  loading,
  ...props
}) {
  const disabled = !installed || loading;

  return (
    <SecondaryButton
      {...props}
      className={cn(
        "flex justify-start",
        "!text14Bold text-textPrimary",
        "disabled:bg-neutral200 disabled:border-neutral200 disabled:select-none disabled:text-textTertiary",
        selected && "bg-neutral300 border-neutral300",
        // icon left(wallet logo)
        "[&_.button-icon-left]:mr-3",
        "[&_.button-icon-left_svg]:w-6 [&_.button-icon-left_svg]:h-6",
        // large size button
        "py-[9px] h-12 pl-[11px]",
        props.className,
      )}
      disabled={disabled}
      iconLeft={logo}
    >
      <span className="inline-flex justify-between items-center w-full">
        {title}
        {loading ? (
          <SystemLoadingDots className="w-5 h-5" />
        ) : (
          !installed && (
            <span className="text12Medium">
              Not installed
              {installUrl && (
                <ExternalLink
                  externalIcon={false}
                  className="ml-3"
                  href={installUrl}
                >
                  <SystemLink className="inline-flex w-5 h-5 text-theme500" />
                </ExternalLink>
              )}
            </span>
          )
        )}
      </span>
    </SecondaryButton>
  );
}
