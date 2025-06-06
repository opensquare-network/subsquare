import LockButton from "./lockButton";
import Tooltip from "next-common/components/tooltip";
import { useChainSettings } from "next-common/context/chain";

const GovLocks = ({ reUseGovLocks, balance, isLoading }) => {
  const chainSettings = useChainSettings();

  return (
    <Tooltip
      content={`Vote using ${chainSettings?.symbol} that's already locked from a previous referendum`}
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
