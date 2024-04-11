import { SecondaryCard } from "../styled/containers/secondaryCard";
import { MenuWhale } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";

export default function WhalesPrompt() {
  return (
    <SecondaryCard
      className={cn("flex !p-6 gap-x-4", "max-sm:flex-col max-sm:gap-y-3")}
    >
      <div className="w-10 h-10 bg-theme100 rounded-lg flex items-center justify-center">
        <MenuWhale className="text-theme500" />
      </div>

      <ul className="list-disc text14Medium text-textPrimary pl-6">
        <li>Votes power: Balance * 6 + max_track_delegations.</li>
        <li>
          Only addresses who have ever voted &nbsp;
          <span className="text-theme500">{">= 1M DOT"}</span>(convicted votes)
          directly are counted.
        </li>
        <li>Holders who have not voted any referenda are not counted.</li>
        <li>
          Holders who are delegating their votes in all tracks are not counted.
        </li>
        <li>Data is recalculated every 10 minutes in the background.</li>
      </ul>
    </SecondaryCard>
  );
}
