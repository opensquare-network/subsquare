import { cn } from "next-common/utils";
import Button from ".";
import { forwardRef } from "react";

const DangerButton = forwardRef(_DangerButton);

export default DangerButton;

/**
 * @param {ButtonProps} props
 */
function _DangerButton(props, ref) {
  return (
    <Button
      ref={ref}
      {...props}
      className={cn(
        "text-textPrimaryContrast",
        "bg-red500 disabled:bg-red300",
        props.className,
      )}
    />
  );
}
