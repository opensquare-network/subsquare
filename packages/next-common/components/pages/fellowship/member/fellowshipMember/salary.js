import ValueDisplay from "next-common/components/valueDisplay";
import useSubCollectiveRank from "next-common/hooks/collectives/useSubCollectiveRank";
import useSubCoreCollectivesMember from "next-common/hooks/collectives/useSubCoreCollectivesMember";
import useCoreFellowshipParams from "next-common/hooks/fellowship/core/useCoreFellowshipParams";
import { toPrecision } from "next-common/utils";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import { getRankSalary } from "next-common/utils/fellowship/getRankSalary";

function Wrapper({ children }) {
  return (
    <div className="flex flex-col w-full pt-[24px] border-t border-neutral300 gap-[12px]">
      <div className="flex flex-col items-center gap-[4px]">{children}</div>
    </div>
  );
}

function NotImportedSalary() {
  return (
    <Wrapper>
      <span className="text14Medium text-textTertiary">Salary</span>
      <span className="text16Bold text-textTertiary">-</span>
    </Wrapper>
  );
}

function MemberSalary({ address, member }) {
  const { isActive } = member || {};
  const { params, isLoading: isParamLoading } = useCoreFellowshipParams();
  const { rank, isLoading: isRankLoading } = useSubCollectiveRank(address);

  if (isParamLoading || isRankLoading) {
    return null;
  }

  const { activeSalary = [], passiveSalary = [] } = params ?? {};
  const { symbol, decimals } = getSalaryAsset();
  const salaryTable = isActive ? activeSalary : passiveSalary;
  const salary = getRankSalary(salaryTable, rank);

  return (
    <Wrapper>
      <span className="text14Medium text-textTertiary">Salary</span>
      <span className="text16Bold text-textPrimary">
        <ValueDisplay value={toPrecision(salary, decimals)} symbol={symbol} />
      </span>
      <span className="text12Medium text-textTertiary">
        Last payment 20d ago
      </span>
    </Wrapper>
  );
}

export default function Salary({ address }) {
  const { member, isLoading } = useSubCoreCollectivesMember(address);

  if (isLoading) {
    return null;
  }

  if (!member) {
    return <NotImportedSalary />;
  }

  return <MemberSalary address={address} member={member} />;
}
