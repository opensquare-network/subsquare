import MultisigsList from "./multisigsList";
import AccountSubTabs from "next-common/components/overview/account/subTabs";

export default function Multisigs() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-[16px]">
        <div className="flex justify-between sm:items-center max-sm:flex-col gap-[12px]">
          <AccountSubTabs />
        </div>
        <MultisigsList />
      </div>
    </div>
  );
}
