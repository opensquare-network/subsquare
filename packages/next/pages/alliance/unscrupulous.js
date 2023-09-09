import { withLoginUserRedux } from "next-common/lib";
import { useUnscrupulousAccounts } from "hooks/useUnscrupulousAccounts";
import { useUnscrupulousWebsites } from "hooks/useUnscrupulousWebsites";
import UnscrupulousSummary from "components/alliance/unscrupulousSummary";
import UnscrupulousAccounts from "components/alliance/unscrupulousAccounts";
import UnscrupulousWebsites from "components/alliance/unscrupulousWebsites";
import ListLayout from "next-common/components/layout/ListLayout";
import { useState } from "react";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";

export default withLoginUserRedux(() => {
  const { data: accounts, isLoading: isAccountsLoading } =
    useUnscrupulousAccounts();
  const { data: websites, isLoading: isWebsitesLoading } =
    useUnscrupulousWebsites();

  const category = "Unscrupulous";
  const seoInfo = { title: category, desc: category };
  const [tab, setTab] = useState("accounts");

  return (
    <ListLayout
      seoInfo={seoInfo}
      title={category}
      description="The current list of accounts/websites deemed unscrupulous."
      summary={
        <UnscrupulousSummary
          accounts={accounts?.length}
          websites={websites?.length}
        />
      }
      tabs={[
        {
          label: "Accounts",
          active: tab === "accounts",
          onClick: () => setTab("accounts"),
        },
        {
          label: "Websites",
          active: tab === "websites",
          onClick: () => setTab("websites"),
        },
      ]}
    >
      {tab === "accounts" && (
        <UnscrupulousAccounts
          items={accounts || []}
          loading={isAccountsLoading}
        />
      )}

      {tab === "websites" && (
        <UnscrupulousWebsites
          items={websites || []}
          loading={isWebsitesLoading}
        />
      )}
    </ListLayout>
  );
});

export const getServerSideProps = getServerSidePropsWithTracks;
