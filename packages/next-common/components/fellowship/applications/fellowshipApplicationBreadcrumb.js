import Breadcrumb from "next-common/components/_Breadcrumb";
import BreadcrumbWrapper from "next-common/components/detail/common/BreadcrumbWrapper";
import { usePost } from "next-common/context/post";
import { addressEllipsis } from "next-common/utils";

export default function FellowshipApplicationBreadcrumb() {
  const post = usePost();
  return (
    <BreadcrumbWrapper>
      <Breadcrumb
        items={[
          {
            path: "/fellowship",
            content: "Fellowship",
          },
          {
            path: "/fellowship/applications",
            content: "Applications",
          },
          {
            content: addressEllipsis(post?.applicant),
          },
        ]}
      />
    </BreadcrumbWrapper>
  );
}
