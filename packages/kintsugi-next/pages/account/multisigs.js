import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
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
  const { result: summary } = await backendApi.fetch("overview/summary");

  return {
    props: {
      summary: summary ?? {},
    },
  };
});
