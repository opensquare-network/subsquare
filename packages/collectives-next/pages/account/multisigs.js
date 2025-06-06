import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import AccountLayout from "next-common/components/layout/AccountLayout";
import Multisigs from "next-common/components/multisigs";

export default function MyMultisigs() {
  return (
    <AccountLayout>
      <Multisigs />
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
