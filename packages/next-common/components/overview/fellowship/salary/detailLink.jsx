import Link from "next/link";
import { useSelector } from "react-redux";
import { fellowshipSalaryStatusSelector } from "next-common/store/reducers/fellowship/salary";

export default function FellowshipSalaryStatsDetailLink() {
  const stats = useSelector(fellowshipSalaryStatusSelector);
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
