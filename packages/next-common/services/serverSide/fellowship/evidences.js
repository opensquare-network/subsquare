import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";

const getFellowshipEvidencesServerSideProps = withCommonProps(async () => {
  const [{ result: evidences }, { result: summary }] = await Promise.all([
    backendApi.fetch("/fellowship/members/evidences"),
    backendApi.fetch("overview/summary"),
  ]);

  return {
    props: {
      evidences,
      summary: summary ?? {},
    },
  };
});

export default getFellowshipEvidencesServerSideProps;
