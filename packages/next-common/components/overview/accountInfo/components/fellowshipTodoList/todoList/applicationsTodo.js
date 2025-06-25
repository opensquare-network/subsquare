import useIsAdmin from "next-common/hooks/useIsAdmin";
import ActionButton from "./actionButton";
import { TodoContent, TodoTag, TodoWrapper } from "./styled";
import { usePageProps } from "next-common/context/page";
import { useRouter } from "next/router";

export default function ApplicationsTodo() {
  const router = useRouter();
  const { summary } = usePageProps();
  const { active = 0 } = summary?.fellowshipApplications || {};
  const isAdmin = useIsAdmin();
  const ApplicationsPage = "/fellowship/applications";

  if (!isAdmin || active <= 0) {
    return null;
  }

  return (
    <TodoWrapper>
      <TodoTag>Membership</TodoTag>
      <TodoContent>
        <a
          className="text-theme500 cursor-pointer"
          target="_blank"
          rel="noreferrer"
          href={ApplicationsPage}
        >
          {active} applications
        </a>
        &nbsp;need your audit.&nbsp;
        <ActionButton onClick={() => router.push(ApplicationsPage)}>
          Check All
        </ActionButton>
      </TodoContent>
    </TodoWrapper>
  );
}
