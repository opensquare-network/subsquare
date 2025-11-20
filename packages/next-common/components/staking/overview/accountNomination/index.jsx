import { isNil } from "lodash-es";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import { useMyStakingLedger } from "next-common/context/staking/myStakingLedger";
import Link from "next/link";

function AccountNominationImpl() {
  const { width } = useWindowSize();

  if (isNil(width)) {
    return null;
  }

  return <NeutralPanel className="p-6 space-y-4"></NeutralPanel>;
}

function AccountNominationEmpty() {
  return (
    <NeutralPanel className="p-6">
      <div className="text-center text14Medium text-textTertiary">
        You are not nominating any pools.{" "}
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

  return <AccountNominationImpl />;
}
