import { cn } from "next-common/utils";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import useReferendaCountsByStatus from "./useReferendaCountsByStatus";
import getStatusColor from "../common";

function SummaryItem({ title, content }) {
  return (
    <div className="flex flex-col gap-[4px]">
      <div className="text-textTertiary text12Medium">{title}</div>
      <div className="text16Bold text-textPrimary">{content}</div>
    </div>
  );
}

function StatusTitle({ status }) {
  const color = getStatusColor(status);
  return (
    <div className="flex gap-[8px] items-center">
      <div
        className="w-[10px] h-[10px] m-[2px] rounded-[2px]"
        style={{ backgroundColor: color }}
      />
      <span className="text12Medium text-textTertiary">{status}</span>
    </div>
  );
}

function ActiveItemContent({ active, total }) {
  return (
    <div className="flex gap-[4px]">
      <span>{active}</span>
      <span className="text-textDisabled">/</span>
      <span className="text-textTertiary">{total}</span>
    </div>
  );
}

export default function SummaryPanel() {
  const { total, active, preparing, queueing, deciding, confirming } =
    useReferendaCountsByStatus();

  return (
    <SecondaryCard>
      <div className="flex gap-[16px] max-sm:flex-col">
        <div className="basis-1/4 max-md:basis-1/3">
          <SummaryItem
            title="Active"
            content={<ActiveItemContent active={active} total={total} />}
          />
        </div>
        <div
          className={cn(
            "flex gap-[16px] flex-wrap grow",
            "[&>*]:basis-[calc((100%/3)-(16px*2/3))] [&>*]:grow",
            "max-md:[&>*]:basis-[calc((100%/2)-(16px*1/2))]",
          )}
        >
          <SummaryItem
            title={<StatusTitle status="Confirming" />}
            content={confirming}
          />
          <SummaryItem
            title={<StatusTitle status="Deciding" />}
            content={deciding}
          />
          <SummaryItem
            title={<StatusTitle status="Preparing" />}
            content={preparing}
          />
          <SummaryItem
            title={<StatusTitle status="Queueing" />}
            content={queueing}
          />
        </div>
      </div>
    </SecondaryCard>
  );
}
