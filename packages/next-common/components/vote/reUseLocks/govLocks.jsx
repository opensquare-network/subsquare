import useQueryGovernanceLock from "next-common/hooks/referenda/useQueryGovernanceLock";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import LockButton from "./lockButton";
import Tooltip from "next-common/components/tooltip";

const GovLocks = ({ reUseGovLocks }) => {
  const address = useRealAddress();
  const { balance, isLoading } = useQueryGovernanceLock(address);

  return (
    <Tooltip
      content="Vote using DOT that's already locked from a previous referendum"
      contentClassName="max-w-[240px]"
    >
      <LockButton
        isLoading={isLoading}
        balance={balance}
        label="Reuse Governance Lock"
        onClick={reUseGovLocks}
      />
    </Tooltip>
  );
};

export default GovLocks;
