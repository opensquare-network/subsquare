import { cn } from "next-common/utils";

/**
 * @param {{dashed?: boolean, color: string} & import("react").HTMLAttributes<HTMLDivElement>} props
 */
export default function LegendItem({ dashed, color = "", ...props }) {
  return (
    <div
      className={cn(
        "flex items-center",
        "text-textSecondary text12Medium",
        "ml-4 first:ml-0",
        props.className,
      )}
      {...props}
    >
      <span
        className={cn(
          "w-3 h-0.5 rounded-full mr-2",
          "bg-repeat-x bg-[size:20px]",
          dashed && "!bg-[size:7px_2px]",
        )}
        style={{
          backgroundImage: `linear-gradient(to right, ${color} 0%, ${color} 50%, transparent 50%)`,
        }}
      />
      {props.children}
    </div>
  );
}
