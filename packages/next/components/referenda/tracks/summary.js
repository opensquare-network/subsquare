import SummaryPanel from "./summaryPanel";

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
