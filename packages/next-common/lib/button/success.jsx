import { cn } from "next-common/utils";
import Button from ".";
import { forwardRef } from "react";

const SuccessButton = forwardRef(_SuccessButton);

export default SuccessButton;

/**
 * @param {ButtonProps} props
 */
function _SuccessButton(props, ref) {
  return (
    <Button
      ref={ref}
      {...props}
      className={cn(
        "text-textPrimaryContrast",
        "bg-green500 disabled:bg-green300",
        props.className,
      )}
    />
  );
}
