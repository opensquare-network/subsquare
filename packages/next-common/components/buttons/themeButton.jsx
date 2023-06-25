import clsx from "clsx";
import PrimaryButton from "./primaryButton";

/**
 * @description button with theme500 and theme100
 */
export default function ThemeButton({
  children,
  isLoading,
  disabled,
  className,
  ...props
}) {
  return (
    <PrimaryButton
      className={clsx("bg-theme500 text-textPrimaryContrast", className)}
      isLoading={isLoading}
      disabled={disabled}
      {...props}
    >
      {children}
    </PrimaryButton>
  );
}
