import { cn } from "next-common/utils";
import { useNavCollapsed } from "next-common/context/nav";

export default function RightPanelContainer({ children, className = "" }) {
  const [navCollapsed] = useNavCollapsed();

  return (
    <div
      className={cn(
        "grid gap-[16px]",
        "grid-cols-2",
        navCollapsed ? "max-[1200px]:grid-cols-1" : "max-[1425px]:grid-cols-1",
        className,
      )}
    >
      {children}
    </div>
  );
}
