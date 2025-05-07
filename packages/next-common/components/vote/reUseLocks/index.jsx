import useQueryGovernanceLock from "next-common/hooks/referenda/useQueryGovernanceLock";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useUserAccountInfo } from "next-common/context/user/account";

import AllLocks from "./allLocks";
import GovLocks from "./govLocks";

const ReUseLocks = ({ reUseGovLocks, reUseAllLocks }) => {
  const address = useRealAddress();
  const { balance: governanceLockBalance, isLoading } =
    useQueryGovernanceLock(address);
  const { info, isLoading: isLoading1 } = useUserAccountInfo();
  const allLockedBalance = info?.data?.lockedBalance;

  if (
    (governanceLockBalance && governanceLockBalance !== "0") ||
    (allLockedBalance && allLockedBalance !== "0")
  ) {
    return (
      <div className="w-full flex flex-wrap gap-2 md:flex-row">
        <GovLocks
          isLoading={isLoading}
          balance={governanceLockBalance}
          reUseGovLocks={reUseGovLocks}
        />
        <AllLocks
          isloading={isLoading1}
          balance={allLockedBalance}
          reUseAllLocks={reUseAllLocks}
        />
      </div>
    );
  }
  return null;
};

export default ReUseLocks;
