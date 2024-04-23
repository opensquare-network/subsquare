import { cn } from "next-common/utils";
import Link from "next/link";

export default function FellowshipSalaryStatsDetailLink({
  index,
  children,
  className = "",
}) {
  return (
    <Link
      href={`/fellowship/salary/cycles/${index}`}
      className={cn("text-theme500", className)}
    >
      {children}
    </Link>
  );
}
