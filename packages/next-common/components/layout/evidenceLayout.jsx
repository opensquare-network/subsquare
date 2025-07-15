import { addressEllipsis } from "next-common/utils";
import BaseLayout from "./baseLayout";
import { usePageProps } from "next-common/context/page";
import { SecondaryCardDetail } from "../styled/containers/secondaryCard";
import { Breadcrumbs } from "./DetailLayout/breadcrumbs";

export default function EvidenceLayout({ seoInfo = {}, children }) {
  const { who, detail } = usePageProps() || {};
  const { indexer } = detail || {};
  const { blockHeight, eventIndex } = indexer || {};

  return (
    <BaseLayout seoInfo={seoInfo}>
      <div className="max-w-[1200px] px-6 py-6 mx-auto w-full">
        <Breadcrumbs
          breadcrumbs={[
            {
              path: `/fellowship/members/${who}`,
              content: addressEllipsis(who),
            },
            {
              content: "Evidence",
            },
            {
              content: `#${blockHeight}-${eventIndex}`,
            },
          ]}
        />
        <SecondaryCardDetail className="!p-12">{children}</SecondaryCardDetail>
      </div>
    </BaseLayout>
  );
}
