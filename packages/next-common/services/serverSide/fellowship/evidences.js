import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
import {
  ambassadorMembersApiUri,
  fellowshipMembersApiUri,
} from "next-common/services/url";

const getFellowshipEvidencesServerSideProps = withCommonProps(async () => {
  const [
    { result: evidences },
    { result: summary },
    { result: fellowshipMembers },
    { result: ambassadorMembers },
  ] = await Promise.all([
    backendApi.fetch("/fellowship/members/evidences"),
    backendApi.fetch("overview/summary"),
    backendApi.fetch(fellowshipMembersApiUri),
    backendApi.fetch(ambassadorMembersApiUri),
  ]);

  const memberAddrSet = new Set(
    (fellowshipMembers || []).map((m) => m.address),
  );
  const evidencesOfMembers = (evidences || []).filter((evidence) =>
    memberAddrSet.has(evidence.address),
  );

  return {
    props: {
      evidences: evidencesOfMembers,
      summary: summary ?? {},
      fellowshipMembers: fellowshipMembers ?? null,
      ambassadorMembers: ambassadorMembers ?? null,
    },
  };
});

export default getFellowshipEvidencesServerSideProps;
