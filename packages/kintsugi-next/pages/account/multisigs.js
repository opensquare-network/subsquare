import { withCommonProps } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import AccountLayout from "next-common/components/account/layout";
import Multisigs from "next-common/components/multisigs";

export default function MyMultisigs() {
  return (
    <AccountLayout>
      <Multisigs />
    </AccountLayout>
  );
}

export const getServerSideProps = withCommonProps(async () => {
  const { result: summary } = await nextApi.fetch("summary");

  return {
    props: {
      summary: summary ?? {},
    },
  };
});
