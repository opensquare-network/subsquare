import { SystemEmptyBox } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";

export default function NoData({
  showIcon = true,
  icon,
  head = "",
  text = "No data",
  className = "",
  children,
  ...props
}) {
  return (
    <div {...props} className={cn("py-6 text-center", className)}>
      {(showIcon || icon) && (
        <div className="flex justify-center mb-2">
          {icon || <SystemEmptyBox className="[&_path]:stroke-textTertiary" />}
        </div>
      )}

      {head && (
        <div className={cn("text16Bold text-textPrimary mb-2")}>{head}</div>
      )}

      <div
        className={cn(
          "text14Medium text-textTertiary inline-flex items-center",
        )}
      >
        {text}
      </div>

      {children}
    </div>
  );
}
