import { SystemEmptyBox } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";

export default function NoData({
  showIcon = true,
  head = "",
  text = "No data",
  className = "",
  ...props
}) {
  return (
    <div {...props} className={cn("py-6 text-center", className)}>
      {showIcon && (
        <SystemEmptyBox className="[&_path]:stroke-textTertiary mx-auto mb-2" />
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
    </div>
  );
}
