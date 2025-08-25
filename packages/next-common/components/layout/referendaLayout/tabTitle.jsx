import { cn } from "next-common/utils";

export default function TabTitle({ active, className = "", children }) {
  return (
    <span
      className={cn(
        "flex items-center cursor-pointer pb-3 text14Bold border-b-4 whitespace-nowrap hover:text-theme500",
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

function NewTag() {
  return (
    <span className="inline-flex items-center text-theme500 bg-theme100 text12Medium px-2 py-[2px] rounded-[10px] ml-2">
      New
    </span>
  );
}

export function DvLabel({ label, active }) {
  return (
    <TabTitle active={active}>
      {label}
      <NewTag />
    </TabTitle>
  );
}
