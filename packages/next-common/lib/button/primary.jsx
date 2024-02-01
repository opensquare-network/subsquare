import { cn } from "next-common/utils";
import Button from ".";

/**
 * @param {ButtonProps} props
 */
export default function PrimaryButton(props) {
  return (
    <Button
      {...props}
      className={cn(
        "text-textPrimaryContrast",
        "bg-theme500 disabled:bg-theme300",
        "border-transparent",
        props.className,
      )}
    />
  );
}
