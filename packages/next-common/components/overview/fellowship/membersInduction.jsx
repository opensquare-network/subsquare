import { SystemInduct, SystemPlus } from "@osn/icons/subsquare";
import DisabledTipButton from "next-common/components/extendButton/disabledTipButton";
import { cn } from "next-common/utils";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
export default function MembersInduction({ className }) {
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
      <DisabledTipButton
        typeStyle="secondary"
        tipMsg="Only available to the members with rank >= 3"
        size="small"
        iconLeft={<SystemPlus className="w-4 h-4" />}
        disabled={true}
      >
        Induct
      </DisabledTipButton>
    </SecondaryCard>
  );
}
