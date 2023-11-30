import { withCommonProps } from "next-common/lib";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import MyDeposits from "next-common/components/myDeposits";
import AccountLayout from "next-common/components/layout/AccountLayout";

export default function AccountDepositsPage() {
  return (
    <AccountLayout>
      <MyDeposits />
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
