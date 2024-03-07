import { cn } from "next-common/utils";
import { useNavCollapsed } from "next-common/context/nav";

export default function MemberCardListContainer({ children }) {
  const [navCollapsed] = useNavCollapsed();

  return (
    <div
      className={cn(
        "grid gap-4",
        "grid-cols-3",
        navCollapsed
          ? "max-md:grid-cols-2"
          : "max-md:grid-cols-1 max-lg:grid-cols-2",
        "max-sm:grid-cols-1",
      )}
    >
      {children}
    </div>
  );
}
