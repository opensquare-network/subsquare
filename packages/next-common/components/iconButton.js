import { cn } from "next-common/utils";

export default function IconButton({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "flex items-center cursor-pointer text12Medium text-theme500 gap-[4px] [&_svg_path]:!stroke-theme500",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
