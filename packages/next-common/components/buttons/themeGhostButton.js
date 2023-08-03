import clsx from "clsx";
import { DarkLoading } from "./loadingV2";
import CommonButton from "./styled";

function NormalGhostButton({ className, ...props }) {
  return (
    <CommonButton
      className={clsx("border-theme500 text-theme500 border", className)}
      {...props}
    />
  );
}

function LoadingGhostButton({ className, ...props }) {
  return (
    <CommonButton
      isLoading={true}
      className={clsx("border-theme300 border", className)}
      {...props}
    >
      <DarkLoading />
    </CommonButton>
  );
}

function DisabledGhostButton({ className, ...props }) {
  return (
    <CommonButton
      disabled={true}
      className={clsx(
        "text-textDisabled border-neutral500 bg-neutral100 border",
        className,
      )}
      {...props}
    />
  );
}

/**
 * @description button with theme500 and theme100
 */
export default function ThemeGhostButton({ isLoading, disabled, ...props }) {
  if (disabled) {
    return <DisabledGhostButton {...props} />;
  }
  if (isLoading) {
    return <LoadingGhostButton {...props} />;
  }
  return <NormalGhostButton {...props} />;
}
