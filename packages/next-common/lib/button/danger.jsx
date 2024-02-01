import { cn } from "next-common/utils";
import Button from ".";

/**
 * @param {ButtonProps} props
 */
export default function DangerButton(props) {
  return (
    <Button
      {...props}
      className={cn(
        "text-textPrimaryContrast",
        "bg-red500 disabled:bg-red300",
        "border-transparent",
        props.className,
      )}
    />
  );
}
