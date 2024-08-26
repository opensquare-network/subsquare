import { useCollectivesContext } from "next-common/context/collectives/collectives";
import { cn } from "next-common/utils";
import Link from "next/link";

export default function FellowshipSalaryStatsDetailLink({
  index,
  children,
  className = "",
}) {
  const { section } = useCollectivesContext();

  return (
    <Link
      href={`/${section}/salary/cycles/${index}`}
      className={cn("text-theme500", className)}
    >
      {children}
    </Link>
  );
}
