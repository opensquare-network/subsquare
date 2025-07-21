import useQueryGovernanceLock from "next-common/hooks/referenda/useQueryGovernanceLock";
import AllLocks from "./allLocks";
import GovLocks from "./govLocks";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { useSubAccountInfo } from "./accountInfo";

const ReUseLocks = ({ reUseGovLocks, reUseAllLocks }) => {
  const signerAccount = useSignerAccount();
  const { balance: governanceLockBalance, isLoading } = useQueryGovernanceLock(
    signerAccount?.realAddress,
  );
  const { info, isLoading: isUserAccountInfoLoading } = useSubAccountInfo(
    signerAccount?.realAddress,
  );
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
          isloading={isUserAccountInfoLoading}
          balance={allLockedBalance}
          reUseAllLocks={reUseAllLocks}
        />
      </div>
    );
  }
  return null;
};

export default ReUseLocks;
