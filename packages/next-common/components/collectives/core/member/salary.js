import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";

export default function CoreFellowshipMemberSalary({
  rank,
  isActive,
  params = {},
}) {
  const { activeSalary, passiveSalary } = params;
  const salaryArray = isActive ? activeSalary : passiveSalary;
  const salary = salaryArray[rank - 1];
  const { symbol, decimals } = useSalaryAsset();

  if (rank <= 0) {
    return null;
  }

  return (
    <div className="bg-neutral200 rounded px-3 py-1.5 mt-3">
      <span className="text12Medium text-textTertiary mr-1 leading-4">
        Salary
      </span>
      <ValueDisplay
        className="text12Medium text-textSecondary leading-4"
        value={toPrecision(salary, decimals)}
        symbol={symbol}
      />
    </div>
  );
}
