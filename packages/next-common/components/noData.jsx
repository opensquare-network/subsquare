import { SystemEmptyBox } from "@osn/icons/subsquare";
import clsx from "clsx";

export default function NoData({
  showIcon = true,
  text = "No data",
  ...props
}) {
  return (
    <div {...props} className={clsx("py-6", props.className)}>
      {showIcon && (
        <SystemEmptyBox className="[&_path]:stroke-textTertiary w-10 h-10 mx-auto" />
      )}

      <p className="mt-2 text14Medium text-textTertiary text-center">{text}</p>
    </div>
  );
}
