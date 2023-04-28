import UnscrupulousAccounts from "./unscrupulousAccounts";
import UnscrupulousWebsites from "./unscrupulousWebsites";
import PageTabs from "next-common/components/pageTabs";

const TabName = {
  Accounts: "Accounts",
  Websites: "Websites",
};

export default function UnscrupulousTabList({
  accounts,
  isAccountsLoading,
  websites,
  isWebsitesLoading,
}) {
  const tabs = [
    {
      name: TabName.Accounts,
      content: (
        <UnscrupulousAccounts
          items={accounts || []}
          loading={isAccountsLoading}
        />
      ),
    },
    {
      name: TabName.Websites,
      content: (
        <UnscrupulousWebsites
          items={websites || []}
          loading={isWebsitesLoading}
        />
      ),
    },
  ];

  return (
    <PageTabs tabs={tabs} />
  );
}
