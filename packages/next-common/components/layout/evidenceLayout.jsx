import { addressEllipsis } from "next-common/utils";
import Breadcrumb from "../_Breadcrumb";
import BreadcrumbWrapper from "../detail/common/BreadcrumbWrapper";
import BaseLayout from "./baseLayout";
import { usePageProperties } from "next-common/context/page";
import { SecondaryCardDetail } from "../styled/containers/secondaryCard";

export default function EvidenceLayout({ seoInfo = {}, children }) {
  const { who } = usePageProperties() || {};
  return (
    <BaseLayout seoInfo={seoInfo}>
      <div className="max-w-[1200px] px-6 pb-6 mx-auto w-full">
        <BreadcrumbWrapper className="py-4 pl-12">
          <Breadcrumb
            items={[
              {
                path: `/fellowship/members/${who}`,
                content: addressEllipsis(who),
              },
              {
                content: "Evidence",
              },
            ]}
          />
        </BreadcrumbWrapper>
        <SecondaryCardDetail className="!p-12">{children}</SecondaryCardDetail>
      </div>
    </BaseLayout>
  );
}
