import { cn } from "next-common/utils";
import Link from "next/link";

export default function AmbassadorSalaryStatsDetailLink({
  index,
  children,
  className = "",
}) {
  return (
    <Link
      href={`/ambassador/salary/cycles/${index}`}
      className={cn("text-theme500", className)}
    >
      {children}
    </Link>
  );
}
