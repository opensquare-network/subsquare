import { useUserAccountInfo } from "next-common/context/user/account";
import LockButton from "./lockButton";

const AllLocks = ({ reUseAllLocks }) => {
  const { info, isLoading } = useUserAccountInfo();
  const lockedBalance = info?.data?.lockedBalance;

  return (
    <LockButton
      isLoading={isLoading}
      balance={lockedBalance}
      label="Reuse all locks"
      onClick={reUseAllLocks}
    />
  );
};

export default AllLocks;
