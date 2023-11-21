import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import Multisigs from "../../components/multisigs";
import AccountLayout from "next-common/components/account/layout";

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
