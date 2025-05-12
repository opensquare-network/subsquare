import { withCommonProps } from "next-common/lib";
import AccountLayout from "next-common/components/layout/AccountLayout";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import MyReceivedDelegations from "components/myDelegation/myReceivedDelegations";

export default function AccountMyReceivedDelegationsPage() {
  return (
    <AccountLayout>
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
