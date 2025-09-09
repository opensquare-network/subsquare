import Tooltip from "next-common/components/tooltip";
import { cn } from "next-common/utils";

export function InfluenceLabel({ className = "" }) {
  return (
    <span className={cn("flex items-center gap-x-1", className)}>
      Influence
      <Tooltip content="Whether the voting of DVs changes the outcome of referendum?"></Tooltip>
    </span>
  );
}
