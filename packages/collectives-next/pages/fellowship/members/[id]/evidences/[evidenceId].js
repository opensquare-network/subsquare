import EvidencePage from "next-common/components/pages/fellowship/member/evidence";
import { withCommonProps } from "next-common/lib";
import { isAddressId, isEvidenceId } from "next-common/utils/routeParams";
import { fetchDetailComments } from "next-common/services/detail";
import { backendApi } from "next-common/services/nextApi";

export default EvidencePage;

export const getServerSideProps = withCommonProps(
  async (context) => {
    const { evidenceId, id: who } = context.params;
    const { result: detail = null } = await backendApi.fetch(
      `fellowship/members/${who}/evidences/${evidenceId}`,
    );

    let comments = null;
    let summary = {};

    if (detail) {
      const [commentsResult, { result: summaryResult }] = await Promise.all([
        fetchDetailComments(
          `fellowship/members/${who}/evidences/${evidenceId}/comments`,
          context,
        ),
        backendApi.fetch("overview/summary"),
      ]);
      comments = commentsResult;
      summary = summaryResult ?? {};
    }

    return {
      props: {
        summary,
        comments,
        who,
        detail,
      },
    };
  },
  // The member is addressed by its address, the evidence by its cid,
  // `<blockHeight>-<eventIndex>`, or block height.
  { validateParams: { id: isAddressId, evidenceId: isEvidenceId } },
);
