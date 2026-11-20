import { SystemLoadingDots } from "@osn/icons/subsquare";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import Tooltip from "next-common/components/tooltip";

function LoadingValue() {
  return <SystemLoadingDots width={20} height={20} />;
}

function PoolSizeValue({ pool }) {
  return (
    <span>
      {pool.cores.toLocaleString()}
      <span className="unit"> cores</span>
    </span>
  );
}

export default function PoolSummaryItems({ systemPool, privatePool, loading }) {
  return (
    <SummaryLayout className="grid-cols-2">
      <SummaryItem
        title={
          <Tooltip content="Coretime supplied to the on-demand market by the system pool. This part is owned by the protocol, its revenue is not paid to private contributors.">
            <span>System pool</span>
          </Tooltip>
        }
      >
        {loading ? <LoadingValue /> : <PoolSizeValue pool={systemPool} />}
      </SummaryItem>

      <SummaryItem
        title={
          <Tooltip content="Coretime supplied to the on-demand market by privately contributed regions. The on-demand revenue of this part belongs to the contributors.">
            <span>Private pool</span>
          </Tooltip>
        }
      >
        {loading ? <LoadingValue /> : <PoolSizeValue pool={privatePool} />}
      </SummaryItem>
    </SummaryLayout>
  );
}
