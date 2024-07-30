import { cn } from "next-common/utils";
import { SecondaryCard } from "./styled/containers/secondaryCard";

export default function MultiPromptPanel({ className, icon, items = [] }) {
  if (!items.length) {
    return null;
  }

  return (
    <SecondaryCard
      className={cn(
        "flex !p-6 gap-x-4",
        "max-sm:flex-col max-sm:gap-y-3",
        className,
      )}
    >
      <div className="w-10 h-10 bg-theme100 rounded-lg flex items-center justify-center">
        {icon}
      </div>

      <ul className="list-disc text14Medium text-textPrimary pl-6">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </SecondaryCard>
  );
}
