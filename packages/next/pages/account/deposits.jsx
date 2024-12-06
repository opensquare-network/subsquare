import MyDeposits from "next-common/components/myDeposits";
import AccountLayout from "next-common/components/layout/AccountLayout";
import { getServerSideProps as getServerSidePropsFn } from "./votes";
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

export const getServerSideProps = getServerSidePropsFn;
