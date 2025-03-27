import CollectivesProvider, {
  useCollectivesContext,
} from "next-common/context/collectives/collectives";
import {
  useAmbassadorMemberData,
  useFellowshipMemberData,
} from "../../context/memberDataContext";
import CollectivesSalaryGetPaymentWarning from "./getPayment";
import CollectivesSalaryRegisterWarning from "./register";
import { isNil } from "lodash-es";
import { useFellowshipSalaryStats } from "next-common/hooks/fellowship/salary/useFellowshipSalaryStats";
import { useIsInSalaryRegistrationPeriod } from "next-common/hooks/fellowship/salary/useIsInSalaryRegistrationPeriod";
import { useIsInSalaryPayoutPeriod } from "next-common/hooks/fellowship/salary/useIsInSalaryPayoutPeriod";

export default function CollectivesSalaryWarnings() {
  return (
    <>
      <CollectivesSalaryFellowshipWarningsImpl />
      <CollectivesSalaryAmbassadorWarningsImpl />
    </>
  );
}

function CollectivesSalaryFellowshipWarningsImpl() {
  const { data, isLoading } = useFellowshipMemberData();

  if (isLoading || isNil(data?.coreMember)) {
    return null;
  }

  return (
    <CollectivesProvider section="fellowship">
      <CollectivesSalaryWarningsImpl />
    </CollectivesProvider>
  );
}

function CollectivesSalaryAmbassadorWarningsImpl() {
  const { data, isLoading } = useAmbassadorMemberData();

  if (isLoading || isNil(data?.coreMember)) {
    return null;
  }

  return (
    <CollectivesProvider section="ambassador">
      <CollectivesSalaryWarningsImpl />
    </CollectivesProvider>
  );
}

function CollectivesSalaryWarningsImpl() {
  const { section } = useCollectivesContext();

  const status = useFellowshipSalaryStats();

  const isInRegistrationPeriod = useIsInSalaryRegistrationPeriod(status);
  const isInPayoutPeriod = useIsInSalaryPayoutPeriod(status);

  return (
    <>
      {isInRegistrationPeriod && (
        <CollectivesSalaryRegisterWarning section={section} status={status} />
      )}
      {isInPayoutPeriod && (
        <CollectivesSalaryGetPaymentWarning section={section} status={status} />
      )}
    </>
  );
}
