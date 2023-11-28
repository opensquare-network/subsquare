import { withCommonProps } from "next-common/lib";
import MyVotes from "components/myvotes";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import AccountLayout from "next-common/components/account/layout";

export default function Votes() {
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
