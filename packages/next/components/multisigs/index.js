import AccountInfo from "next-common/components/overview/accountInfo";
import { AccountSubTabs } from "components/overview/account/subTabs";
import MultisigsList from "./multisigsList";

export default function Multisigs() {
  return (
    <div className="space-y-6">
      <AccountInfo hideManageAccountLink />

      <div className="flex flex-col gap-[16px]">
        <div className="flex justify-between sm:items-center max-sm:flex-col gap-[12px]">
          <AccountSubTabs />
        </div>
        <MultisigsList />
      </div>
    </div>
  );
}
