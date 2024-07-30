import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";

function getStatusColor(status) {
  switch (status) {
    case "Preparing":
      return "#2196F3";
    case "Queueing":
      return "#FF9800";
    case "Deciding":
      return "#0F6FFF";
    case "Confirming":
      return "#4CAF50";
    default:
      return "";
  }
}

function SummaryItem({ title, content }) {
  return (
    <div className="flex flex-col max-sm:w-[calc(50%-8px)] sm:w-[263px] gap-[4px]">
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

function SummaryPanel() {
  return (
    <SecondaryCard>
      <div className="flex gap-[16px] max-sm:flex-col">
        <div>
          <SummaryItem
            title="Active"
            content={<ActiveItemContent active={73} total={824} />}
          />
        </div>
        <div className="flex gap-[16px] grow flex-wrap">
          <SummaryItem title={<StatusTitle status="Preparing" />} content="8" />
          <SummaryItem title={<StatusTitle status="Queueing" />} content="0" />
          <SummaryItem title={<StatusTitle status="Deciding" />} content="56" />
          <SummaryItem
            title={<StatusTitle status="Confirming" />}
            content="9"
          />
        </div>
      </div>
    </SecondaryCard>
  );
}

export default function ReferendaTracksSummary() {
  return (
    <div className="flex flex-col">
      <span className="ml-[24px] mb-[16px] text16Bold text-textPrimary">
        Referenda
      </span>
      <SummaryPanel />
    </div>
  );
}
