import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import { Breadcrumbs } from "../DetailLayout/breadcrumbs";
import { usePageProps } from "next-common/context/page";
import { AddressUser } from "next-common/components/user";

export default function EvidenceLayoutBreadcrumbs() {
  const isMobile = useIsMobile();
  const { who, detail } = usePageProps() || {};
  const { indexer } = detail || {};
  const { blockHeight } = indexer || {};

  return (
    <Breadcrumbs
      breadcrumbs={[
        {
          path: "/fellowship/members",
          content: "Members",
        },
        {
          path: `/fellowship/members/${who}`,
          content: (
            <AddressUser add={who} showAvatar={false} needHref={false} />
          ),
          className: "flex",
        },
        isMobile
          ? null
          : {
              content: "Evidence",
            },
        {
          content: `#${blockHeight}`,
        },
      ].filter(Boolean)}
    />
  );
}
