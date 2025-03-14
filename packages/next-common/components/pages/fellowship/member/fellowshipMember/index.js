import ContentLayout from "next-common/components/layout/contentLayout";
import MemberInfoCard from "./memberInfoCard";
import FellowshipMemberBreadcrumb from "./fellowshipMemberBreadcrumb";
import Membership from "./membership";
import OnchainEvidence from "./onchainEvidence";
import Referenda from "./referenda";

export default function FellowshipMember({ address }) {
  const seoInfo = {
    title: "Fellowship Member",
  };

  return (
    <ContentLayout seoInfo={seoInfo} hasSidebar>
      <div className="flex flex-col">
        <FellowshipMemberBreadcrumb address={address} />
        <div className="flex gap-[24px]">
          <MemberInfoCard address={address} />
          <div className="flex flex-col gap-[24px] grow">
            <Membership />
            <OnchainEvidence />
            <Referenda />
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
