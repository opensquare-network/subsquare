import { cn } from "next-common/utils";
import Button from ".";

/**
 * @param {ButtonProps} props
 */
export default function SecondaryButton(props) {
  return (
    <Button
      {...props}
      className={cn(
        "text-textPrimary disabled:text-textDisabled",
        "bg-neutral100",
        "border-neutral400 hover:border-neutral500",
        "disabled:border-neutral200",
        props.className,
      )}
    />
  );
}
