import { SystemLoading } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import { forwardRef } from "react";

const Button = forwardRef(_Button);

export default Button;

/**
 * @param {ButtonProps} props
 * @private
 */
function _Button(props, ref) {
  const {
    size,
    loading,
    className,
    children,
    disabled,
    iconLeft,
    iconRight,
    ...attrs
  } = props ?? {};

  const smallSize = size === "small";
  const iconSize = size === "icon" || loading;

  return (
    <button
      ref={ref}
      {...attrs}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center",
        "border border-transparent",
        "outline-none",
        "whitespace-nowrap",
        smallSize ? "text12Medium" : "text14Medium",
        // height
        "h-10",
        smallSize && "h-7",
        // padding
        "py-[7px] px-[15px]",
        iconLeft && "pl-[7px]",
        iconRight && "pr-[7px]",
        iconSize && "p-[7px]",
        smallSize &&
          cn(
            "py-[5px] px-[11px]",
            iconLeft && "pl-[5px]",
            iconRight && "pr-[5px]",
            iconSize && "p-[5px]",
          ),
        // border radius
        "rounded-lg",
        smallSize && "rounded-md",
        className,
      )}
    >
      {loading ? (
        <SystemLoading className={cn(smallSize && "w-4 h-4")} />
      ) : (
        <>
          {iconLeft && (
            <span className="icon-left inline-flex mr-1">{iconLeft}</span>
          )}
          {children}
          {iconRight && (
            <span className="icon-right inline-flex ml-1">{iconRight}</span>
          )}
        </>
      )}
    </button>
  );
}
