import AccountSubTabs from "next-common/components/overview/account/subTabs";
import PalletTabs from "next-common/components/profile/delegation/palletTabs";
import { ModuleTab } from "next-common/components/profile/votingHistory/common";
import { cn } from "next-common/utils";

export default function MyDelegationLayout({ children }) {
  return (
    <PalletTabs>
      <div
        className={cn(
          "flex justify-between items-center gap-3 mx-6",
          "max-sm:block max-sm:space-y-3",
        )}
      >
        <AccountSubTabs />
        <ModuleTab />
      </div>
      {children}
    </PalletTabs>
  );
}
