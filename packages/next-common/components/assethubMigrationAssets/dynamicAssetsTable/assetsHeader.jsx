import { cn } from "next-common/utils";
import { useNavCollapsed } from "next-common/context/nav";

export default function AssetsHeader({ columnsDef, classNames, styles }) {
  const [navCollapsed] = useNavCollapsed();

  return (
    <div
      className={cn(
        "datalist-head flex items-center pb-3 border-b border-neutral300",
        navCollapsed ? "max-sm:hidden" : "max-md:hidden",
      )}
    >
      {columnsDef.map((col, idx) => (
        <div
          key={idx}
          className={cn("text-textTertiary", classNames[idx])}
          style={styles[idx]}
        >
          {col.name}
        </div>
      ))}
    </div>
  );
}
