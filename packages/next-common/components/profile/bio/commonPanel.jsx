import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { useTheme } from "styled-components";
import { cn } from "next-common/utils";
import { noop } from "lodash-es";

export default function CommonPanel({
  children,
  className = "",
  extra = null,
  onExtraBtnClick = noop,
}) {
  const { isDark } = useTheme();

  const backgroundImage = isDark
    ? "linear-gradient(180deg, rgba(30, 33, 48, 0.80) 0%, rgba(30, 33, 48, 0.00) 100%)"
    : "linear-gradient(180deg, rgba(246, 247, 250, 0.80) 0%, rgba(246, 247, 250, 0.00) 100%)";

  return (
    <GreyPanel
      className={cn(
        "flex flex-col bg-neutral100 text14Medium text-textPrimary p-4 pb-0 max-w-full rounded-[12px] gap-y-2",
        className,
      )}
      style={{
        background: "none",
        backgroundImage,
      }}
    >
      {extra && (
        <div
          role="button"
          className="absolute right-4 top-4 w-7 h-7 flex items-center justify-center shrink-0 border border-neutral400 rounded-[8px] cursor-pointer bg-neutral100"
          onClick={onExtraBtnClick}
        >
          {extra}
        </div>
      )}
      {children}
    </GreyPanel>
  );
}
