import HelpOthersContent from "next-common/components/recovery/helpOthers";
import AccountLayout from "next-common/components/layout/AccountLayout";
import AccountSubTabs from "next-common/components/overview/account/subTabs";
import { withCommonProps } from "next-common/lib";

export default function AccountHelpRecoverPage() {
  return (
    <AccountLayout seoInfo={{ title: "Account help recover" }}>
      <div className="space-y-6">
        <AccountSubTabs className="mx-6" />
        <HelpOthersContent />
      </div>
    </AccountLayout>
  );
}

export const getServerSideProps = withCommonProps();
