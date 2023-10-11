import { SystemEmptyBox } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";

export default function NoData({
  showIcon = true,
  text = "No data",
  className = "",
  ...props
}) {
  return (
    <div {...props} className={cn("py-6", className)}>
      {showIcon && (
        <SystemEmptyBox className="[&_path]:stroke-textTertiary [&_path]:stroke-[0.9] w-10 h-10 mx-auto mb-2" />
      )}

      <p
        className={cn(
          "text14Medium text-textTertiary",
          "flex items-center justify-center flex-wrap",
        )}
      >
        {text}
      </p>
    </div>
  );
}
