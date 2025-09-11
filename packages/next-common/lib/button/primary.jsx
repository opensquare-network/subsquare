import { cn } from "next-common/utils";
import Button from ".";
import { forwardRef } from "react";

const PrimaryButton = forwardRef(_PrimaryButton);

export default PrimaryButton;

/**
 * @param {ButtonProps} props
 */
function _PrimaryButton(props, ref) {
  return (
    <Button
      ref={ref}
      {...props}
      className={cn(
        "text-textPrimaryContrast",
        "bg-theme500 disabled:bg-theme300",
        props.className,
      )}
    />
  );
}
