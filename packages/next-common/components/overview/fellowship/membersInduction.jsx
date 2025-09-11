import { SystemInduct } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Induct from "next-common/components/fellowship/core/summary/induct";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useFellowshipCanInductMember } from "next-common/hooks/fellowship/useFellowshipCanInductMember";

export default function MembersInduction({ className }) {
  const realAddress = useRealAddress();
  const canInductMember = useFellowshipCanInductMember();

  if (!realAddress || !canInductMember) {
    return null;
  }

  return (
    <SecondaryCard
      className={cn(
        "flex items-center justify-between gap-4",
        "max-md:flex-col",
        className,
      )}
    >
      <div
        className={cn(
          "w-full",
          "flex items-center gap-3",
          "max-md:flex-col max-md:items-start",
        )}
      >
        <SystemInduct className="w-10 h-10 text-textTertiary" />
        <div className="flex flex-col">
          <span className="text-textPrimary text14Bold">
            New Member Induction
          </span>
          <span className="text-textTertiary text14Medium">
            Induct a member starting with rank 0
          </span>
        </div>
      </div>

      <div className="self-end">
        <Induct size="large" />
      </div>
    </SecondaryCard>
  );
}
