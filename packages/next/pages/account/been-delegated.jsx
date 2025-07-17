import { withCommonProps } from "next-common/lib";
import AccountLayout from "next-common/components/layout/AccountLayout";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import MyReceivedDelegations from "next-common/components/pages/components/myDelegation/myReceivedDelegations";

export default function AccountMyReceivedDelegationsPage() {
  return (
    <AccountLayout seoInfo={{ title: "Delegations to my account" }}>
      <MyReceivedDelegations />
    </AccountLayout>
  );
}

export const getServerSideProps = withCommonProps(async () => {
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      summary: tracksProps.summary,
      ...tracksProps,
    },
  };
});
