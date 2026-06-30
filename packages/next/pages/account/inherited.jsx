import InheritorsContent from "next-common/components/recovery/inheritors";
import AccountLayout from "next-common/components/layout/AccountLayout";
import AccountSubTabs from "next-common/components/overview/account/subTabs";
import { withCommonProps } from "next-common/lib";

export default function AccountInheritantsPage() {
  return (
    <AccountLayout seoInfo={{ title: "Account inheritants" }}>
      <div className="space-y-6">
        <AccountSubTabs className="mx-6" />
        <InheritorsContent />
      </div>
    </AccountLayout>
  );
}

export const getServerSideProps = withCommonProps();
