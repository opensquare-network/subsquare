import { withCommonProps } from "next-common/lib";
import AccountLayout from "next-common/components/layout/AccountLayout";
import MyVotes from "components/myvotes";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";

export default function AccountVotesPage() {
  return (
    <AccountLayout>
      <MyVotes />
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
