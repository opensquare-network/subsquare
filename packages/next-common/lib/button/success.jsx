import { cn } from "next-common/utils";
import Button from ".";

/**
 * @param {ButtonProps} props
 */
export default function SuccessButton(props) {
  return (
    <Button
      {...props}
      className={cn(
        "text-textPrimaryContrast",
        "bg-green500 disabled:bg-green300",
        "border-transparent",
        props.className,
      )}
    />
  );
}
