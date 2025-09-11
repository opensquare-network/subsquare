import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";

export default function SummaryLayout({ className, children }) {
  const [navCollapsed] = useNavCollapsed();

  return (
    <div
      className={cn(
        "w-full grid grid-cols-4 gap-4",
        navCollapsed ? "max-sm:grid-cols-2" : "max-md:grid-cols-2",
        className,
      )}
    >
      {children}
    </div>
  );
}
