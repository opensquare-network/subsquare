import { cn } from "next-common/utils";

export default function IconButton({
  children,
  disabled,
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "flex items-center cursor-pointer text12Medium gap-[4px]",
        disabled
          ? "text-textDisabled pointer-events-none"
          : "text-theme500 [&_svg_path]:!stroke-theme500",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
