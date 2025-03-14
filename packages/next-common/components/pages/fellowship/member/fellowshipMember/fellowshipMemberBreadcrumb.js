import Breadcrumb from "next-common/components/_Breadcrumb";
import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import { addressEllipsis } from "next-common/utils";

export default function FellowshipMemberBreadcrumb({ address }) {
  return (
    <div className="px-[48px] py-[24px]">
      <BreadcrumbWrapper>
        <Breadcrumb
          items={[
            {
              path: "/fellowship",
              content: "Fellowship",
            },
            {
              path: "/fellowship/members",
              content: "Members",
            },
            {
              content: addressEllipsis(address),
            },
          ]}
        />
      </BreadcrumbWrapper>
    </div>
  );
}
