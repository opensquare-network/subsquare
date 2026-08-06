import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import CollectivesProvider from "next-common/context/collectives/collectives";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";
import { useFellowshipCollectiveMembers } from "next-common/hooks/fellowship/core/useFellowshipCollectiveMembers";
import { useFellowshipSalaryStats } from "next-common/hooks/fellowship/salary/useFellowshipSalaryStats";
import useMySalaryClaimant from "next-common/hooks/fellowship/salary/useMySalaryClaimant";
import {
  useIsInSalaryRegistrationPeriod,
  useIsSalaryPayoutPeriod,
} from "next-common/hooks/fellowship/salary/useIsInSalaryRegistrationPeriod";
import { getSecretaryMemberSalary } from "next-common/utils/secretary/salary";
import ActionButton from "./actionButton";
import { TodoContent, TodoTag, TodoWrapper } from "./styled";

const SecretarySalaryRegisterPopup = dynamicPopup(() =>
  import("next-common/components/fellowship/salary/actions/register/popup"),
);
const SecretarySalaryPayoutPopup = dynamicPopup(() =>
  import("next-common/components/fellowship/salary/actions/payout/popup"),
);

function SecretarySalaryRegistrationTodo({
  claimant,
  isInRegistrationPeriod,
  mySalary,
  salaryStats,
}) {
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const isSalaryRegistered = claimant?.lastActive >= salaryStats.cycleIndex;

  if (
    !isInRegistrationPeriod ||
    !claimant ||
    isSalaryRegistered ||
    mySalary <= 0
  ) {
    return null;
  }

  return (
    <>
      <TodoWrapper>
        <TodoTag>Secretary Salary</TodoTag>
        <TodoContent>
          The salary cycle is in the registration period,&nbsp;
          <ActionButton onClick={() => setShowRegisterPopup(true)}>
            Register now
          </ActionButton>
        </TodoContent>
      </TodoWrapper>
      {showRegisterPopup && (
        <SecretarySalaryRegisterPopup
          onClose={() => setShowRegisterPopup(false)}
        />
      )}
    </>
  );
}

function SecretarySalaryPayoutTodo({
  claimant,
  isInPayoutPeriod,
  salaryStats,
}) {
  const [showPayoutPopup, setShowPayoutPopup] = useState(false);
  const isPaid =
    claimant?.status?.attempted &&
    claimant.lastActive >= salaryStats.cycleIndex;

  if (!isInPayoutPeriod || !claimant || isPaid) {
    return null;
  }

  return (
    <>
      <TodoWrapper>
        <TodoTag>Secretary Salary</TodoTag>
        <TodoContent>
          The salary cycle is in the payout period.&nbsp;
          <ActionButton onClick={() => setShowPayoutPopup(true)}>
            Claim now
          </ActionButton>
        </TodoContent>
      </TodoWrapper>
      {showPayoutPopup && (
        <SecretarySalaryPayoutPopup onClose={() => setShowPayoutPopup(false)} />
      )}
    </>
  );
}

function SecretarySalaryTodosImpl() {
  const address = useRealAddress();
  const { members, loading: isLoadingMembers } =
    useFellowshipCollectiveMembers();
  const salaryStats = useFellowshipSalaryStats();
  const { claimant, isLoading: isLoadingClaimant } = useMySalaryClaimant();
  const isInRegistrationPeriod = useIsInSalaryRegistrationPeriod(salaryStats);
  const isInPayoutPeriod = useIsSalaryPayoutPeriod(salaryStats);
  const member = (members || []).find((item) =>
    isSameAddress(item.address, address),
  );
  const mySalary = getSecretaryMemberSalary(member?.rank ?? 0);

  if (isLoadingMembers || isLoadingClaimant || !salaryStats || !member) {
    return null;
  }

  return (
    <>
      <SecretarySalaryRegistrationTodo
        claimant={claimant}
        isInRegistrationPeriod={isInRegistrationPeriod}
        mySalary={mySalary}
        salaryStats={salaryStats}
      />
      <SecretarySalaryPayoutTodo
        claimant={claimant}
        isInPayoutPeriod={isInPayoutPeriod}
        salaryStats={salaryStats}
      />
    </>
  );
}

export default function SecretarySalaryTodos() {
  return (
    <CollectivesProvider section="secretary">
      <SecretarySalaryTodosImpl />
    </CollectivesProvider>
  );
}
