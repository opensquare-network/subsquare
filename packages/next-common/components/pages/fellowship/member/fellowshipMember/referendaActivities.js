import { cn } from "next-common/utils";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { CardTitle } from "./styled";

function Square({ className, children }) {
  return (
    <div className="p-[1px]">
      <div className={cn("w-[10px] h-[10px] rounded-[2px]", className)}>
        {children}
      </div>
    </div>
  );
}

function AyeSquare() {
  return <Square className="bg-green300" />;
}

function NaySquare() {
  return <Square className="bg-red300" />;
}

function NoVoteSquare() {
  return <Square className="bg-neutral300" />;
}

function NotEligibleSquare() {
  return (
    <Square className="bg-neutral300 p-[2px]">
      <div className="w-full h-full bg-neutral100"></div>
    </Square>
  );
}

function LegendItem({ children, text }) {
  return (
    <div className="flex gap-[8px] text12Medium items-center">
      {children}
      <span className="text-textSecondary">{text}</span>
    </div>
  );
}

function LegendBar() {
  return (
    <div className="flex justify-center">
      <div className="flex gap-[16px]">
        <LegendItem text="Aye">
          <AyeSquare />
        </LegendItem>
        <LegendItem text="Nay">
          <NaySquare />
        </LegendItem>
        <LegendItem text="No Vote">
          <NoVoteSquare />
        </LegendItem>
        <LegendItem text="Not Eligible">
          <NotEligibleSquare />
        </LegendItem>
      </div>
    </div>
  );
}

export default function ReferendaActivities() {
  return (
    <SecondaryCard>
      <div className="flex flex-col gap-[16px]">
        <CardTitle>Attendance</CardTitle>
        <LegendBar />
        <CardTitle>History</CardTitle>
      </div>
    </SecondaryCard>
  );
}
