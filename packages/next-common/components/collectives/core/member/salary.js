import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { getRankSalary } from "next-common/utils/fellowship/getRankSalary";
import Tooltip from "next-common/components/tooltip";

export function CoreFellowshipMemberSalaryContent({
  className,
  rank,
  isActive,
  params = {},
}) {
  const { activeSalary, passiveSalary } = params;
  const salaryArray = isActive ? activeSalary : passiveSalary;
  const salary = getRankSalary(salaryArray, rank);
  const { symbol, decimals } = getSalaryAsset();

  return (
    <ValueDisplay
      className={className}
      value={toPrecision(salary, decimals)}
      symbol={symbol}
    />
  );
}

export default function CoreFellowshipMemberSalary({
  className = "text14Medium",
  member,
  params = {},
}) {
  const { rank } = member;
  const { isActive } = member.status || {};

  const { activeSalary = [], passiveSalary = [] } = params ?? {};
  const { symbol, decimals } = getSalaryAsset();

  if (rank <= 0) {
    return null;
  }

  return (
    <Tooltip
      content={
        <div>
          <div>This member is {isActive ? "active" : "passive"}</div>
          <div className="flex gap-1">
            <span>Active Salary: </span>
            <span>
              {toPrecision(getRankSalary(activeSalary, rank), decimals)}
              &nbsp;{symbol}
            </span>
          </div>
          <div className="flex gap-1">
            <span>Passive Salary:</span>
            <span>
              {toPrecision(getRankSalary(passiveSalary, rank), decimals)}
              &nbsp;{symbol}
            </span>
          </div>
        </div>
      }
    >
      <CoreFellowshipMemberSalaryContent
        className={className}
        rank={rank}
        isActive={isActive}
        params={params}
      />
    </Tooltip>
  );
}
