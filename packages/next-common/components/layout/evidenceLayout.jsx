import BaseLayout from "./baseLayout";
import { usePageProps } from "next-common/context/page";
import { SecondaryCardDetail } from "../styled/containers/secondaryCard";
import { Breadcrumbs } from "./DetailLayout/breadcrumbs";
import { AddressUser } from "../user";

export default function EvidenceLayout({ seoInfo = {}, children }) {
  const { who, detail } = usePageProps() || {};
  const { indexer } = detail || {};
  const { blockHeight } = indexer || {};

  return (
    <BaseLayout seoInfo={seoInfo}>
      <div className="max-sm:px-0 px-6">
        <div className="max-w-[856px] py-6 mx-auto w-full max-sm:px-0">
          <Breadcrumbs
            breadcrumbs={[
              {
                path: "/fellowship/members",
                content: "Members",
              },
              {
                content: <AddressUser add={who} showAvatar={false} />,
                className: "flex",
              },
              {
                content: `#${blockHeight}`,
              },
            ]}
          />
          <SecondaryCardDetail className="max-sm:!p-6 !p-12">
            {children}
          </SecondaryCardDetail>
        </div>
      </div>
    </BaseLayout>
  );
}
