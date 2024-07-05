import { cn } from "next-common/utils";

export default function DotSplitter({ className = "" }) {
  return <span className={cn("text-textTertiary mx-2", className)}>·</span>;
}
