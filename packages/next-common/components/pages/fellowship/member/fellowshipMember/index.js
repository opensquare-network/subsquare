import ContentLayout from "next-common/components/layout/contentLayout";
import MemberInfoCard from "./memberInfoCard";
import FellowshipMemberBreadcrumb from "./fellowshipMemberBreadcrumb";
import Membership from "./membership";
import OnchainEvidence from "./onchainEvidence";
import MemberActivities from "./memberActivities";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";

export default function FellowshipMember({ address }) {
  const [navCollapsed] = useNavCollapsed();

  const seoInfo = {
    title: "Fellowship Member",
  };

  return (
    <ContentLayout seoInfo={seoInfo}>
      <div className="flex flex-col">
        <FellowshipMemberBreadcrumb address={address} />
        <div
          className={cn(
            "flex gap-[24px] items-start",
            navCollapsed ? "max-sm:flex-col" : "max-md:flex-col",
          )}
        >
          <MemberInfoCard
            className={cn(
              "w-[320px] min-w-[320px]",
              navCollapsed ? "max-sm:w-full" : "max-md:w-full",
            )}
            address={address}
          />
          <div
            className={cn("flex flex-col gap-[24px]", "w-full overflow-hidden")}
          >
            <Membership />
            <OnchainEvidence />
            <MemberActivities />
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
