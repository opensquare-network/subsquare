import useSubFellowshipSalaryStats from "next-common/hooks/fellowship/salary/useSubFellowshipSalaryStats";
import Link from "next/link";

export default function FellowshipSalaryStatsDetailLink() {
  const stats = useSubFellowshipSalaryStats();

  if (!stats?.cycleIndex) {
    return null;
  }

  return (
    <Link
      href={`/fellowship/salary/cycles/${stats?.cycleIndex}`}
      className="text14Medium text-theme500"
    >
      View Detail
    </Link>
  );
}
