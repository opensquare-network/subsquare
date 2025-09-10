import { useMemo } from "react";
import NotFoundDetail from "next-common/components/notFoundDetail";
import AddressUser from "next-common/components/user/addressUser";
import { useRouter } from "next/router";
import WindowSizeProvider from "next-common/context/windowSize";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";

function EvidencePageNotFoundImpl({ props }) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const evidenceId = router.query.evidenceId;

  const mobileBreadcrumbItems = useMemo(
    () => [
      {
        path: "/fellowship/members",
        content: "Members",
      },
      {
        content: (
          <AddressUser add={props.who} showAvatar={false} link="/fellowship" />
        ),
        className: "flex",
      },
    ],
    [props.who],
  );

  const desktopBreadcrumbItems = useMemo(
    () => [
      {
        path: "/fellowship",
        content: "Fellowship",
      },
      {
        path: "/fellowship/members",
        content: "Members",
      },
      {
        content: (
          <AddressUser add={props.who} showAvatar={false} link="/fellowship" />
        ),
        className: "flex",
      },
      {
        content: "Evidences",
      },
    ],
    [props.who],
  );

  const responsiveBreadcrumbItems = useMemo(
    () => (isMobile ? mobileBreadcrumbItems : desktopBreadcrumbItems),
    [isMobile, mobileBreadcrumbItems, desktopBreadcrumbItems],
  );

  return (
    <NotFoundDetail
      customId={`#${evidenceId}`}
      breadcrumbItems={responsiveBreadcrumbItems}
    />
  );
}

export default function EvidencePageNotFound({ props }) {
  return (
    <WindowSizeProvider>
      <EvidencePageNotFoundImpl props={props} />
    </WindowSizeProvider>
  );
}
