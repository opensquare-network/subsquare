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
        <li>
          Addresses that have ever voted{" "}
          <span className="text-theme500">{">= 1M DOT"}</span> are defined as
          whales.
        </li>
        <li>The list is refreshed every 10 minutes.</li>
      </ul>
    </SecondaryCard>
  );
}
