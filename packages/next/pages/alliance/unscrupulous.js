import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import HomeLayout from "next-common/components/layout/HomeLayout";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { useUnscrupulousAccounts } from "hooks/useUnscrupulousAccounts";
import { useUnscrupulousWebsites } from "hooks/useUnscrupulousWebsites";
import UnscrupulousSummary from "components/alliance/unscrupulousSummary";
import UnscrupulousTabList from "components/alliance/unscrupulousTabList";

export default withLoginUserRedux(() => {
  const { data: accounts, isLoading: isAccountsLoading } =
    useUnscrupulousAccounts();
  const { data: websites, isLoading: isWebsitesLoading } =
    useUnscrupulousWebsites();

  const category = "Unscrupulous";
  const seoInfo = { title: category, desc: category };

  return (
    <HomeLayout seoInfo={seoInfo}>
      <TitleContainer>{category}</TitleContainer>
      <UnscrupulousSummary
        accounts={accounts?.length}
        websites={websites?.length}
      />
      <UnscrupulousTabList
        accounts={accounts}
        isAccountsLoading={isAccountsLoading}
        websites={websites}
        isWebsitesLoading={isWebsitesLoading}
      />
    </HomeLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  return {
    props: {},
  };
});
