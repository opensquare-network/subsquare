import AccountLayout from "next-common/components/layout/AccountLayout";
import { getServerSideProps as getServerSidePropsFn } from "./votes";

export default function AccountDepositsPage() {
  return (
    <AccountLayout>
      <div>deposits</div>
    </AccountLayout>
  );
}

export const getServerSideProps = getServerSidePropsFn;
