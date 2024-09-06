import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { getRankSalary } from "next-common/utils/fellowship/getRankSalary";

export default function CoreFellowshipMemberSalary({
  rank,
  isActive,
  params = {},
}) {
  const { activeSalary, passiveSalary } = params;
  const salaryArray = isActive ? activeSalary : passiveSalary;
  const salary = getRankSalary(salaryArray, rank);
  const { symbol, decimals } = getSalaryAsset();

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
