import EvidencePage from "next-common/components/pages/fellowship/member/evidence";
import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
import { to404 } from "next-common/utils/serverSideUtil";

export default EvidencePage;

export const getServerSideProps = withCommonProps(async (context) => {
  const { evidenceId, id: who } = context.params;
  const { result: detail } = await backendApi.fetch(
    `fellowship/members/${who}/evidences/${evidenceId}`,
  );

  if (!detail) {
    return to404();
  }

  const [commentsResult] = await Promise.all([
    backendApi.fetch(
      `fellowship/members/${who}/evidences/${evidenceId}/comments`,
    ),
  ]);

  return {
    props: {
      comments: commentsResult.result,
      who,
      detail,
    },
  };
});
