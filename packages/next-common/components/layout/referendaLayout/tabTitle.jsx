import { cn } from "next-common/utils";

export default function TabTitle({ active, className = "", children }) {
  return (
    <span
      className={cn(
        "flex items-center cursor-pointer pb-3 text14Bold border-b-4 whitespace-nowrap hover:text-theme500 text-textPrimary",
        className,
        {
          "text-theme500 border-theme500": active,
          "border-transparent": !active,
        },
      )}
    >
      {children}
    </span>
  );
}

export function DvLabel({ label, active }) {
  return <TabTitle active={active}>{label}</TabTitle>;
}
