import useIsAdmin from "next-common/hooks/useIsAdmin";
import { TodoContent, TodoTag, TodoWrapper } from "./styled";
import { usePageProps } from "next-common/context/page";
import Link from "next-common/components/link";
import { useIsCollectivesMember } from "../context/hooks/mine";
import pluralize from "pluralize";
import LinkButton from "next-common/components/styled/linkButton";

export default function ApplicationsTodo() {
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
          {active} {pluralize("application", active)}
        </Link>
        &nbsp;to join fellowship need your review.&nbsp;
        <LinkButton href={ApplicationsPage}>Check All</LinkButton>
      </TodoContent>
    </TodoWrapper>
  );
}
