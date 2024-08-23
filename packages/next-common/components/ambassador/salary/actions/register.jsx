import { find, map } from "lodash-es";
import Tooltip from "next-common/components/tooltip";
import { useMyAmbassadorSalaryClaimantFromContext } from "next-common/context/ambassador/myClaimant";
import { usePageProps } from "next-common/context/page";
import { useFellowshipCollectiveMembers } from "next-common/hooks/fellowship/core/useFellowshipCollectiveMembers";
import { useIsInSalaryRegistrationPeriod } from "next-common/hooks/fellowship/salary/useIsInSalaryRegistrationPeriod";
import SecondaryButton from "next-common/lib/button/secondary";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { ambassadorSalaryStatusSelector } from "next-common/store/reducers/ambassador/salary";
import rankToIndex from "next-common/utils/fellowship/rankToIndex";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

const FellowshipSalaryRegisterPopup = dynamicPopup(() =>
  import("next-common/components/fellowship/salary/actions/register/popup"),
);

function useMySalary() {
  const { members } = useFellowshipCollectiveMembers();
  const address = useRealAddress();
  const member = find(members, { address });
  const { ambassadorParams } = usePageProps();
  const { member: coreMember, isLoading } =
    useMyAmbassadorSalaryClaimantFromContext();
  if (!member || !coreMember || isLoading) {
    return 0;
  }

  const { activeSalary = [], passiveSalary = [] } = ambassadorParams || {};
  const rank = member.rank;
  const { isActive } = coreMember || {};
  const salaryArray = isActive ? activeSalary : passiveSalary;

  return salaryArray[rankToIndex(rank)];
}

export default function AmbassadorSalaryRegister() {
  const [disabled, setDisabled] = useState(true);
  const address = useRealAddress();
  const { members } = useFellowshipCollectiveMembers();
  const memberAddrs = map(members, "address");
  const { claimant } = useMyAmbassadorSalaryClaimantFromContext();
  const [showPopup, setShowPopup] = useState(false);
  const status = useSelector(ambassadorSalaryStatusSelector);
  const isRegistrationPeriod = useIsInSalaryRegistrationPeriod(status);
  const mySalary = useMySalary();

  useEffect(() => {
    if (
      !status ||
      !memberAddrs.includes(address) ||
      !isRegistrationPeriod ||
      !claimant ||
      mySalary <= 0 ||
      claimant.lastActive >= status.cycleIndex
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [isRegistrationPeriod, address, memberAddrs]);

  const tooltipText = useMemo(() => {
    if (!isRegistrationPeriod) {
      return "Not in registration period";
    } else if (!address) {
      return "Connect your address please";
    } else if (!memberAddrs.includes(address)) {
      return "Not a collective member";
    } else if (!claimant) {
      return "Please import yourself first";
    } else if (mySalary <= 0) {
      return "No salary to claim";
    } else if (claimant.lastActive >= status?.cycleIndex) {
      return "Already registered";
    }

    return null;
  }, [isRegistrationPeriod, address, memberAddrs]);

  return (
    <>
      <Tooltip content={tooltipText}>
        <SecondaryButton
          size="small"
          disabled={disabled}
          onClick={() => setShowPopup(true)}
        >
          Register
        </SecondaryButton>
      </Tooltip>

      {showPopup && (
        <FellowshipSalaryRegisterPopup
          onClose={() => {
            setShowPopup(false);
          }}
        />
      )}
    </>
  );
}
