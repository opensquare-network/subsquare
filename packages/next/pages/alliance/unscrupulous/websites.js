import { useUnscrupulousAccounts } from "next-common/hooks/pages/useUnscrupulousAccounts";
import { useUnscrupulousWebsites } from "next-common/hooks/pages/useUnscrupulousWebsites";
import UnscrupulousLayout from "components/alliance/unscrupulousLayout";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";
import UnscrupulousWebsites from "components/alliance/unscrupulousWebsites";

export default function UnscrupulousWebsitesPage() {
  const { data: accounts } = useUnscrupulousAccounts();
  const { data: websites, isLoading: isWebsiteLoading } =
    useUnscrupulousWebsites();

  return (
    <UnscrupulousLayout accounts={accounts} websites={websites}>
      <UnscrupulousWebsites items={websites || []} loading={isWebsiteLoading} />
    </UnscrupulousLayout>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
