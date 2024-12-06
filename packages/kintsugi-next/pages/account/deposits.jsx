import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import MyDeposits from "next-common/components/myDeposits";
import AccountLayout from "next-common/components/layout/AccountLayout";
import { MyProxiesProvider } from "next-common/components/myProxies/context/myProxies";

export default function AccountDepositsPage() {
  return (
    <AccountLayout>
      <MyProxiesProvider>
        <MyDeposits />
      </MyProxiesProvider>
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
