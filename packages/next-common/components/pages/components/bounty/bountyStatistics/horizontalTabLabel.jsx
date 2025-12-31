import { cn } from "next-common/utils";

export default function HorizontalTabLabel({ label, isActive }) {
  return (
    <div
      className={cn(
        "flex items-center gap-x-2 text14Bold",
        isActive ? "text-theme500" : "text-textPrimary",
      )}
    >
      {label}
    </div>
  );
}
