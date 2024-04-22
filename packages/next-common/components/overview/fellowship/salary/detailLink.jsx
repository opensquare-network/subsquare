import Link from "next/link";

export default function FellowshipSalaryStatsDetailLink({ index, children }) {
  return (
    <Link
      href={`/fellowship/salary/cycles/${index}`}
      className="text14Medium text-theme500"
    >
      {children}
    </Link>
  );
}
