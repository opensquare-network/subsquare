import MyProxies from "next-common/components/myProxies";
import AccountLayout from "next-common/components/layout/AccountLayout";
import { withCommonProps } from "next-common/lib";

export default function AccountProxiesPage() {
  return (
    <AccountLayout>
      <MyProxies />
    </AccountLayout>
  );
}

export const getServerSideProps = withCommonProps(async () => {
  return {
    props: {},
  };
});
