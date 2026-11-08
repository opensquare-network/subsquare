import ContactsList from "./contactsList";
import AccountSubTabs from "next-common/components/overview/account/subTabs";
import WithPageWidth from "next-common/components/common/withPageWidth";
import { NeutralPanel } from "../styled/containers/neutralPanel";
import { ContactsProvider } from "./context/contactsContext";

export default function Contacts() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-[16px]">
        <div className="flex justify-between sm:items-center max-sm:flex-col gap-[12px]">
          <AccountSubTabs className="mx-6" />
        </div>
        <WithPageWidth>
          <NeutralPanel className="p-6">
            <ContactsProvider>
              <ContactsList />
            </ContactsProvider>
          </NeutralPanel>
        </WithPageWidth>
      </div>
    </div>
  );
}
