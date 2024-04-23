import { SystemInduct } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Induct from "next-common/components/fellowship/core/summary/induct";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function MembersInduction({ className }) {
  const realAddress = useRealAddress();

  if (!realAddress) {
    return null;
  }

  return (
    <SecondaryCard
      className={cn("flex items-center justify-between", className)}
    >
      <div className="flex items-center gap-3">
        <SystemInduct className="w-10 h-10 text-textTertiary" />
        <div className="flex flex-col">
          <span className="text-textPrimary text14Bold">
            New Members Induction
          </span>
          <span className="text-textTertiary text14Medium">
            Inducting active account into the Polkadot Technical Fellowship
            starting with rank 0
          </span>
        </div>
      </div>

      <Induct size="large" />
    </SecondaryCard>
  );
}
