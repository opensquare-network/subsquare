import clsx from "clsx";
import { LightLoading } from "./loadingV2";
import CommonButton from "./styled";

function NormalThemeButton({ className, ...props }) {
  return (
    <CommonButton
      className={clsx(
        "bg-theme500 text-textPrimaryContrast rounded-[8px]",
        className,
      )}
      {...props}
    />
  );
}

function DisabledThemeButton({ className, ...props }) {
  return (
    <CommonButton
      disabled={true}
      className={clsx(
        "bg-theme300 text-textPrimaryContrast rounded-[8px]",
        className,
      )}
      {...props}
    />
  );
}

function LoadingThemeButton({ className, ...props }) {
  return (
    <CommonButton
      isLoading={true}
      className={clsx(
        "bg-theme300 text-textPrimaryContrast rounded-[8px]",
        className,
      )}
      {...props}
    >
      <LightLoading />
    </CommonButton>
  );
}

/**
 * @description button with theme500 and theme100
 */
export default function ThemeButton({ isLoading, disabled, ...props }) {
  if (disabled) {
    return <DisabledThemeButton {...props} />;
  }
  if (isLoading) {
    return <LoadingThemeButton {...props} />;
  }
  return <NormalThemeButton {...props} />;
}
