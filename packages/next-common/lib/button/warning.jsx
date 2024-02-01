import { cn } from "next-common/utils";
import Button from ".";

/**
 * @param {ButtonProps} props
 */
export default function WarningButton(props) {
  return (
    <Button
      {...props}
      className={cn(
        "text-textPrimaryContrast",
        "bg-orange500 disabled:bg-orange300",
        props.className,
      )}
    />
  );
}
