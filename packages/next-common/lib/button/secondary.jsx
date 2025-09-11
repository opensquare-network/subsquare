import { cn } from "next-common/utils";
import Button from ".";
import { forwardRef } from "react";

const SecondaryButton = forwardRef(_SecondaryButton);

export default SecondaryButton;

/**
 * @param {ButtonProps} props
 */
function _SecondaryButton(props, ref) {
  return (
    <Button
      {...props}
      ref={ref}
      className={cn(
        "text-textPrimary disabled:text-textDisabled",
        "bg-neutral100",
        "border-neutral400 hover:border-neutral500",
        "disabled:border-neutral300",
        props.className,
      )}
    />
  );
}
