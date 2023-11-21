import MyDeposits from "components/myDeposits";
import AccountLayout from "next-common/components/layout/AccountLayout";
import { getServerSideProps as getServerSidePropsFn } from "./votes";

export default function AccountDepositsPage() {
  return (
    <AccountLayout>
      <MyDeposits />
    </AccountLayout>
  );
}

export const getServerSideProps = getServerSidePropsFn;
