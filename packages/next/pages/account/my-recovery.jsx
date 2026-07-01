import MyRecoveryContent from "next-common/components/recovery/myRecovery";
import AccountLayout from "next-common/components/layout/AccountLayout";
import AccountSubTabs from "next-common/components/overview/account/subTabs";
import { withCommonProps } from "next-common/lib";

export default function AccountMyRecoveryPage() {
  return (
    <AccountLayout seoInfo={{ title: "My account recovery settings" }}>
      <div className="space-y-6">
        <AccountSubTabs className="mx-6" />
        <MyRecoveryContent />
      </div>
    </AccountLayout>
  );
}

export const getServerSideProps = withCommonProps();
