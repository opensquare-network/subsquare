import Duration from "next-common/components/duration";
import ValueDisplay from "next-common/components/valueDisplay";
import { usePageProps } from "next-common/context/page";
import useSubCollectiveRank from "next-common/hooks/collectives/useSubCollectiveRank";
import useSubCoreCollectivesMember from "next-common/hooks/collectives/useSubCoreCollectivesMember";
import { toPrecision } from "next-common/utils";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";
import { getRankSalary } from "next-common/utils/fellowship/getRankSalary";
import {
  BorderedRow,
  Header,
  Value,
} from "next-common/components/referenda/tally/styled";
import { InfoAsset, InfoDocs } from "@osn/icons/subsquare";
import Tooltip from "next-common/components/tooltip";
import React, { useMemo, useState } from "react";
import SecondaryButton from "next-common/lib/button/secondary";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { cn } from "next-common/utils";
import RegistrationAndPayoutActionsContext, {
  useRegistrationAndPayoutJudgementInfoFromContext,
} from "next-common/context/fellowship/registrationAndPayoutActions.js";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

const FellowshipSalaryRegisterPopup = dynamicPopup(() =>
  import("next-common/components/fellowship/salary/actions/register/popup"),
);

const FellowshipSalaryPayoutPopup = dynamicPopup(() =>
  import("next-common/components/fellowship/salary/actions/payout/popup"),
);

function Wrapper({ children }) {
  return (
    <div className="flex flex-col w-full pt-[24px] border-t border-neutral300 gap-[12px]">
      {children}
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

const Register = React.memo(function Register({ className = "" }) {
  const { registrationJudgementInfo } =
    useRegistrationAndPayoutJudgementInfoFromContext();

  const {
    isRegistrationPeriod,
    address,
    claimant,
    mySalary,
    onInBlock,
    status,
  } = registrationJudgementInfo;

  const [showPopup, setShowPopup] = useState(false);

  let disabled =
    !status ||
    !isRegistrationPeriod ||
    !claimant ||
    mySalary <= 0 ||
    claimant.lastActive >= status.cycleIndex;

  const tooltipText = useMemo(() => {
    if (!isRegistrationPeriod) {
      return "Not in registration period";
    } else if (!address) {
      return "Connect your address please";
    } else if (!claimant) {
      return "Please import yourself first";
    } else if (mySalary <= 0) {
      return "No salary to claim";
    } else if (claimant.lastActive >= status?.cycleIndex) {
      return "Already registered";
    }

    return null;
  }, [isRegistrationPeriod, address, claimant, mySalary, status?.cycleIndex]);

  return (
    <>
      <Tooltip content={tooltipText}>
        <SecondaryButton
          size="small"
          className={cn(
            "border-none",
            "text14Medium",
            "p-0",
            !disabled && "!text-theme500",
            className,
          )}
          disabled={disabled}
          onClick={() => setShowPopup(true)}
        >
          Register
        </SecondaryButton>
      </Tooltip>

      {showPopup && (
        <FellowshipSalaryRegisterPopup
          onClose={() => setShowPopup(false)}
          onInBlock={onInBlock}
          onFinalized={onInBlock}
        />
      )}
    </>
  );
});

const Payout = React.memo(function Payout({ className = "" }) {
  const [showPopup, setShowPopup] = useState(false);
  const { payoutJudgementInfo } =
    useRegistrationAndPayoutJudgementInfoFromContext();

  const {
    address,
    claimant,
    isLoading: isLoadingClaimant,
    isStarted,
    isCollectiveMember,
    cycleIndex,
  } = payoutJudgementInfo;

  const paid =
    claimant && claimant.status?.attempted && claimant.lastActive >= cycleIndex;
  const disabled =
    !address ||
    !isStarted ||
    !isCollectiveMember ||
    isLoadingClaimant ||
    !claimant ||
    paid;

  let tooltipText = null;
  if (!address) {
    tooltipText = "Connect your address please";
  } else if (!isCollectiveMember) {
    tooltipText = "Not a collective member";
  } else if (!isStarted) {
    tooltipText = "The payout period is not started";
  } else if (isLoadingClaimant) {
    tooltipText = "Checking your payment status";
  } else if (!claimant) {
    tooltipText = "Please import yourself first";
  } else if (paid) {
    tooltipText = "Your salary has been paid";
  }

  return (
    <>
      <Tooltip content={tooltipText}>
        <SecondaryButton
          size="small"
          className={cn(
            "border-none",
            "text14Medium",
            "p-0",
            !disabled && "!text-theme500",
            className,
          )}
          disabled={disabled}
          onClick={() => setShowPopup(true)}
        >
          Payout
        </SecondaryButton>
      </Tooltip>
      {showPopup && (
        <FellowshipSalaryPayoutPopup onClose={() => setShowPopup(false)} />
      )}
    </>
  );
});

function MemberSalary({ address, member }) {
  const { fellowshipParams, claimantCycleStats } = usePageProps();
  const { isActive } = member || {};
  const { rank, loading: isRankLoading } = useSubCollectiveRank(address);
  const currentUserAddress = useRealAddress();
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
      <RegistrationAndPayoutActionsContext>
        {currentUserAddress === address && (
          <ActionsWrapper>
            <Register />
            <Payout />
          </ActionsWrapper>
        )}
      </RegistrationAndPayoutActionsContext>
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
