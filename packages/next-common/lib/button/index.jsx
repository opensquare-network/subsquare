import { SystemLoading } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";

/**
 * @param {ButtonProps} props
 * @private
 */
export default function _Button(props) {
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
        smallSize && "rounded",
        className,
      )}
    >
      {loading ? (
        <SystemLoading className={cn(smallSize && "w-4 h-4")} />
      ) : (
        <>
          {iconLeft && <span className="inline-flex mr-2">{iconLeft}</span>}
          {children}
          {iconRight && <span className="inline-flex ml-2">{iconRight}</span>}
        </>
      )}
    </button>
  );
}
