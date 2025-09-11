import { SystemLoading } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import PrimaryButton from "./primary";

/**
 * @param {ButtonProps} props
 * @private
 */
export default function LoadingButton({ size, children, ...props }) {
  const smallSize = size === "small";

  return (
    <PrimaryButton disabled size={size} {...props}>
      <span className="inline-flex mr-1">
        <SystemLoading className={cn(smallSize && "w-4 h-4")} />
      </span>
      {children}
    </PrimaryButton>
  );
}
