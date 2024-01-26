import { usePageProps } from "next-common/context/page";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";

export default function FellowshipMemberSalary({ rank, isActive }) {
  const {
    fellowshipParams: { activeSalary, passiveSalary },
  } = usePageProps();
  const salaryArray = isActive ? activeSalary : passiveSalary;
  const salary = salaryArray[rank - 1];
  const { symbol, decimals } = useSalaryAsset();

  if (rank <= 0) {
    return null;
  }

  return (
    <div className="bg-neutral200 rounded px-3 py-1.5 mt-3">
      <span className="text12Medium text-textTertiary mr-1">Salary</span>
      <ValueDisplay
        className="text12Medium text-textSecondary"
        value={toPrecision(salary, decimals)}
        symbol={symbol}
      />
    </div>
  );
}
