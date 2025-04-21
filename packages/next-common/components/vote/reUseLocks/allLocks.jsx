import { useUserAccountInfo } from "next-common/context/user/account";
import LockButton from "./lockButton";
import Tooltip from "next-common/components/tooltip";

const AllLocks = ({ reUseAllLocks }) => {
  const { info, isLoading } = useUserAccountInfo();
  const lockedBalance = info?.data?.lockedBalance;

  return (
    <Tooltip
      content="Vote using DOT that's all locked"
      contentClassName="max-w-[240px]"
    >
      <LockButton
        isLoading={isLoading}
        balance={lockedBalance}
        label="Reuse All Locks"
        onClick={reUseAllLocks}
      />
    </Tooltip>
  );
};

export default AllLocks;
