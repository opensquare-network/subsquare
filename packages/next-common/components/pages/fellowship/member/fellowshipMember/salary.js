import React from "react";
import Duration from "next-common/components/duration";
import ValueDisplay from "next-common/components/valueDisplay";
import { usePageProps } from "next-common/context/page";
import useSubCollectiveRank from "next-common/hooks/collectives/useSubCollectiveRank";
import useSubCoreCollectivesMember from "next-common/hooks/collectives/useSubCoreCollectivesMember";
import { isSameAddress, toPrecision } from "next-common/utils";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import { getRankSalary } from "next-common/utils/fellowship/getRankSalary";
import {
  BorderedRow,
  Header,
  Value,
} from "next-common/components/referenda/tally/styled";
import { InfoAsset, InfoDocs } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useFellowshipMemberDetailAddr from "next-common/hooks/collectives/member/detail";
import Register from "next-common/components/fellowship/members/detail/actions/register";

function Wrapper({ children }) {
  return (
    <div className="flex flex-col w-full pt-[24px] border-t border-neutral300 gap-[12px]">
      {children}
    </div>
  );
}

function ActionsWrapper({ children, className = "" }) {
  return (
    <div
      className={cn(
        "flex",
        "justify-end",
        "items-center",
        "mt-2",
        "gap-x-4",
        className,
      )}
    >
      {React.Children.map(children, (child) => React.cloneElement(child))}
    </div>
  );
}

function NotImportedSalary() {
  return (
    <Wrapper>
      <div className="flex flex-col items-center gap-[4px]">
        <span className="text14Medium text-textTertiary">Salary</span>
        <span className="text16Bold text-textTertiary">-</span>
      </div>
    </Wrapper>
  );
}

function LastPayment() {
  const { lastSalaryPayment } = usePageProps();
  const { paidIndexer } = lastSalaryPayment || {};

  if (!paidIndexer) {
    return null;
  }

  return (
    <span className="text12Medium text-textTertiary">
      Last payment <Duration time={paidIndexer.blockTime} />
    </span>
  );
}

function SalaryValue({ salary }) {
  const { symbol, decimals } = getSalaryAsset();
  return (
    <span className="text16Bold text-textPrimary">
      <ValueDisplay value={toPrecision(salary, decimals)} symbol={symbol} />
    </span>
  );
}

function TotalPaid({ totalPaid }) {
  const { decimals } = getSalaryAsset();
  return (
    <BorderedRow>
      <Header className="text14Medium">
        <InfoAsset className="w-[20px] h-[20px]" />
        Total Paid
      </Header>
      <Value className="text14Medium">
        <ValueDisplay value={toPrecision(totalPaid, decimals)} prefix="$" />
      </Value>
    </BorderedRow>
  );
}

function JoinedCycles({ joinedCycles }) {
  return (
    <BorderedRow>
      <Header className="text14Medium">
        <InfoDocs className="w-[20px] h-[20px]" />
        Joined Cycles
      </Header>
      <Value className="text14Medium">{joinedCycles}</Value>
    </BorderedRow>
  );
}

function Statistics({ totalPaid, joinedCycles }) {
  return (
    <div className="flex flex-col w-full [&_svg_path]:fill-textTertiary">
      <TotalPaid totalPaid={totalPaid} />
      <JoinedCycles joinedCycles={joinedCycles} />
    </div>
  );
}

function MemberSalary({ address, member }) {
  const { fellowshipParams, claimantCycleStats } = usePageProps();
  const { isActive } = member || {};
  const { rank, loading: isRankLoading } = useSubCollectiveRank(address);

  if (isRankLoading) {
    return null;
  }

  const { activeSalary = [], passiveSalary = [] } = fellowshipParams ?? {};
  const salaryTable = isActive ? activeSalary : passiveSalary;
  const salary = getRankSalary(salaryTable, rank);

  return (
    <Wrapper>
      <div className="flex flex-col items-center gap-[4px]">
        <span className="text14Medium text-textTertiary">Salary</span>
        <SalaryValue salary={salary} />
        <LastPayment />
      </div>
      <Statistics
        totalPaid={claimantCycleStats?.totalSalary || 0}
        joinedCycles={claimantCycleStats?.cycles || 0}
      />
      <MyActionsComponentGuard>
        <ActionsWrapper>
          <Register />
        </ActionsWrapper>
      </MyActionsComponentGuard>
    </Wrapper>
  );
}

function MyActionsComponentGuard({ children }) {
  const currentUserAddress = useRealAddress();
  const address = useFellowshipMemberDetailAddr();
  if (isSameAddress(currentUserAddress, address)) {
    return children;
  } else {
    return null;
  }
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
