import clsx from "clsx";
import GhostButton from "./ghostButton";

/**
 * @description button with theme500 and theme100
 */
export default function ThemeGhostButton({
  children,
  isLoading,
  disabled,
  className,
  ...props
}) {
  return (
    <GhostButton
      className={clsx("!border-theme500 !text-theme500", className)}
      isLoading={isLoading}
      disabled={disabled}
      {...props}
    >
      {children}
    </GhostButton>
  );
}
