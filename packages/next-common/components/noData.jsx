import { SystemEmptyBox } from "@osn/icons/subsquare";
import clsx from "clsx";

export default function NoData({
  showIcon = true,
  text = "No data",
  className = "",
  ...props
}) {
  return (
    <div {...props} className={clsx("py-6", className)}>
      {showIcon && (
        <SystemEmptyBox className="[&_path]:stroke-textTertiary w-10 h-10 mx-auto" />
      )}

      <p
        className={clsx(
          "mt-2 text14Medium text-textTertiary",
          "flex items-center justify-center flex-wrap",
        )}
      >
        {text}
      </p>
    </div>
  );
}
