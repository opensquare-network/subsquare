import NotFoundDetail from "next-common/components/notFoundDetail";
import AddressUser from "next-common/components/user/addressUser";
import { useRouter } from "next/router";
import WindowSizeProvider from "next-common/context/windowSize";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";

function EvidencePageNotFoundImpl({ props }) {
  const router = useRouter();
  const pathSegments = router.asPath?.split("/");
  const evidenceId = pathSegments[pathSegments?.length - 1];
  const isMobile = useIsMobile();

  return (
    <NotFoundDetail
      customId={`#${evidenceId}`}
      breadcrumbItems={[
        isMobile
          ? null
          : {
              path: "/fellowship",
              content: "Fellowship",
            },
        {
          path: "/fellowship/members",
          content: "Members",
        },
        {
          content: (
            <AddressUser
              add={props.who}
              showAvatar={false}
              link="/fellowship"
            />
          ),
          className: "flex",
        },
        isMobile
          ? null
          : {
              content: "Evidences",
            },
      ].filter(Boolean)}
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
