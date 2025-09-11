import { cn } from "next-common/utils";

export default function CoreFellowshipMemberInfoTitle({
  children,
  className = "",
}) {
  return (
    <h3
      className={cn("leading-4 text12Medium text-textTertiary mb-3", className)}
    >
      {children}
    </h3>
  );
}
