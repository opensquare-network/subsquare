import { withCommonProps } from "next-common/lib";
import AccountLayout from "next-common/components/layout/AccountLayout";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import MyDelegations from "next-common/components/pages/components/myDelegation/myDelegations";

export default function AccountMyDelegationsPage() {
  return (
    <AccountLayout>
      <MyDelegations />
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
