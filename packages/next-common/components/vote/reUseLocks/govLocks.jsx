import useQueryGovernanceLock from "next-common/hooks/referenda/useQueryGovernanceLock";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import LockButton from "./lockButton";

const GovLocks = ({ reUseGovLocks }) => {
  const address = useRealAddress();
  const { balance, isLoading } = useQueryGovernanceLock(address);

  return (
    <LockButton
      isLoading={isLoading}
      balance={balance}
      label="Reuse governance lock"
      onClick={reUseGovLocks}
    />
  );
};

export default GovLocks;
