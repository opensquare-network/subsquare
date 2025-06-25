import useIsAdmin from "next-common/hooks/useIsAdmin";
import ActionButton from "./actionButton";
import { TodoContent, TodoTag, TodoWrapper } from "./styled";
import { usePageProps } from "next-common/context/page";
import { useRouter } from "next/router";
import Link from "next/link";
import { useIsCollectivesMember } from "../context/hooks/mine";

export default function ApplicationsTodo() {
  const router = useRouter();
  const { summary } = usePageProps();
  const isCollectivesMember = useIsCollectivesMember();
  const { active = 0 } = summary?.fellowshipApplications || {};
  const isAdmin = useIsAdmin();
  const ApplicationsPage = "/fellowship/applications";
  const hasPermission = isAdmin || isCollectivesMember;

  if (!hasPermission || active <= 0) {
    return null;
  }

  return (
    <TodoWrapper>
      <TodoTag>Membership</TodoTag>
      <TodoContent>
        <Link className="text-theme500 cursor-pointer" href={ApplicationsPage}>
          {active} applications
        </Link>
        &nbsp;need your audit.&nbsp;
        <ActionButton onClick={() => router.push(ApplicationsPage)}>
          Check All
        </ActionButton>
      </TodoContent>
    </TodoWrapper>
  );
}
