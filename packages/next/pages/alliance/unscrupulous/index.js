import { useUnscrupulousAccounts } from "next-common/hooks/pages/useUnscrupulousAccounts";
import { useUnscrupulousWebsites } from "next-common/hooks/pages/useUnscrupulousWebsites";
import UnscrupulousAccounts from "components/alliance/unscrupulousAccounts";
import UnscrupulousLayout from "components/alliance/unscrupulousLayout";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";

export default function UnscrupulousAccountsPage() {
  const { data: accounts, isLoading: isAccountsLoading } =
    useUnscrupulousAccounts();
  const { data: websites } = useUnscrupulousWebsites();

  return (
    <UnscrupulousLayout accounts={accounts} websites={websites}>
      <UnscrupulousAccounts
        items={accounts || []}
        loading={isAccountsLoading}
      />
    </UnscrupulousLayout>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
