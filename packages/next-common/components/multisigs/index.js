import MultisigsList from "./multisigsList";
import AccountSubTabs from "next-common/components/overview/account/subTabs";
import WithPageWidth from "next-common/components/common/withPageWidth";

export default function Multisigs() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-[16px]">
        <div className="flex justify-between sm:items-center max-sm:flex-col gap-[12px]">
          <AccountSubTabs className="mx-6" />
        </div>
        <WithPageWidth>
          <MultisigsList />
        </WithPageWidth>
      </div>
    </div>
  );
}
