import EvidencePage from "next-common/components/pages/fellowship/member/evidence";
import { backendApi } from "next-common/services/nextApi";
import { fellowshipMembersApiUri } from "next-common/services/url";
import { to404 } from "next-common/utils/serverSideUtil";

export default EvidencePage;

function formatEvidenceId(who, evidenceId) {
  // If evidenceId is a blockHeight
  if (/^\d+$/.test(evidenceId)) {
    const blockHeight = Number(evidenceId);
    return {
      who,
      blockHeight,
    };
  }

  // If evidenceId is a "blockHeight-eventIndex"
  if (/^\d+-\d+$/.test(evidenceId)) {
    const [blockHeight, eventIndex] = evidenceId.split("-").map(Number);
    return {
      who,
      blockHeight,
      eventIndex,
    };
  }

  return {
    who,
    cid: evidenceId,
  };
}

export async function getServerSideProps(context) {
  const { evidenceId, id: who } = context.params;
  const { result: detail } = await backendApi.fetch(
    `fellowship/members/${who}/evidences/${evidenceId}`,
  );

  if (!detail) {
    return to404();
  }

  const [fellowshipMembersResult, commentsResult] = await Promise.all([
    backendApi.fetch(fellowshipMembersApiUri),
    backendApi.fetch(
      `fellowship/members/${who}/evidences/${evidenceId}/comments`,
    ),
  ]);

  return {
    props: {
      indexer: formatEvidenceId(who, evidenceId),
      fellowshipMembers: fellowshipMembersResult.result,
      comments: commentsResult.result,
      who,
      detail,
    },
  };
}
