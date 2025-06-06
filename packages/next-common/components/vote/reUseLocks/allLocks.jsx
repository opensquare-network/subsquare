import LockButton from "./lockButton";
import Tooltip from "next-common/components/tooltip";
import { useChainSettings } from "next-common/context/chain";

const AllLocks = ({ reUseAllLocks, balance, isLoading }) => {
  const chainSettings = useChainSettings();

  return (
    <Tooltip
      content={`Vote using ${chainSettings?.symbol} that's all locked`}
      contentClassName="max-w-[240px]"
    >
      <LockButton
        isLoading={isLoading}
        balance={balance}
        label="Reuse All Locks"
        onClick={reUseAllLocks}
      />
    </Tooltip>
  );
};

export default AllLocks;
