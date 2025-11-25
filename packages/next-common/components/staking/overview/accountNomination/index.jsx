import { isNil } from "lodash-es";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import { useMyStakingLedger } from "next-common/context/staking/myStakingLedger";
import Link from "next/link";
import { CurrentEraStakersProvider } from "next-common/context/staking/currentEraStakers";
import Loading from "next-common/components/loading";
import { useValidatorsWithStatus } from "next-common/hooks/staking/useValidatorWithStatus";

function AccountNominationImpl() {
  const { width } = useWindowSize();
  const { nominators } = useMyStakingLedger();
  const { active, loading } = useValidatorsWithStatus(
    nominators?.targets || [],
  );

  if (isNil(width)) {
    return null;
  }

  if (loading) {
    return (
      <NeutralPanel className="p-6 text-center">
        <Loading size={20} />
      </NeutralPanel>
    );
  }

  let message = null;
  if (nominators.length === 0) {
    message = "Inactive: No Nominations Set";
  } else if (active.length === 0) {
    message = "Waiting for Active Nominations";
  } else {
    message = "Nominating and Earning Rewards";
  }

  return (
    <NeutralPanel className="p-6 space-y-4">
      <div>{message}</div>
    </NeutralPanel>
  );
}

function AccountNominationEmpty() {
  return (
    <NeutralPanel className="p-6">
      <div className="text-center text14Medium text-textTertiary">
        You are not nominating any validators.{" "}
        <Link
          className="cursor-pointer text-theme500 hover:underline"
          href="/staking/validators"
        >
          Start Nominating
        </Link>
      </div>
    </NeutralPanel>
  );
}

export default function AccountNomination() {
  const { nominators, loading } = useMyStakingLedger();

  if (loading) {
    return null;
  }

  if (isNil(nominators)) {
    return <AccountNominationEmpty />;
  }

  return (
    <CurrentEraStakersProvider>
      <AccountNominationImpl />
    </CurrentEraStakersProvider>
  );
}
