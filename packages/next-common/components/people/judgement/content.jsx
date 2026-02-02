import { useJudgementContext } from "./context";
import ContentVerifications from "./contentVerifications";
import ContentLoading from "./contentLoading";
import ContentEmpty from "./contentEmpty";

export default function JudgementPageContent() {
  const { myJudgementRequest: request, isLoadingMyJudgementRequest: loading } =
    useJudgementContext();

  if (loading) {
    return <ContentLoading />;
  }

  if (!request) {
    return <ContentEmpty />;
  }

  return <ContentVerifications request={request} />;
}
