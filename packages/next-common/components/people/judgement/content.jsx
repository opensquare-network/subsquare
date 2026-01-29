import Loading from "next-common/components/loading";
import Discord from "./discord";
import Element from "./element";
import Email from "./email";
import Github from "./github";
import JudgementSummary from "./summary";
import Twitter from "./twitter";
import { useJudgementContext } from "./context";

export default function JudgementPageContent() {
  const { myJudgementRequest: request, isLoadingMyJudgementRequest: loading } =
    useJudgementContext();

  return (
    <>
      <JudgementSummary request={request} loading={loading} />
      <div className="pt-4 grid grid-cols-1 gap-4 text-textPrimary">
        {loading && !request ? (
          <div className="p-4 flex justify-center">
            <Loading size="24" />
          </div>
        ) : (
          <>
            {request?.info?.email && (
              <div className="bg-neutral100 border-b border-neutral300 p-4 rounded-lg flex">
                <Email request={request} />
              </div>
            )}
            {request?.info?.matrix && (
              <div className="bg-neutral100 border-b border-neutral300 p-4 rounded-lg flex">
                <Element request={request} />
              </div>
            )}
            {request?.info?.discord && (
              <div className="bg-neutral100 border-b border-neutral300 p-4 rounded-lg flex">
                <Discord request={request} />
              </div>
            )}
            {request?.info?.twitter && (
              <div className="bg-neutral100 border-b border-neutral300 p-4 rounded-lg flex">
                <Twitter request={request} />
              </div>
            )}
            {request?.info?.github && (
              <div className="bg-neutral100 border-b border-neutral300 p-4 rounded-lg flex">
                <Github request={request} />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
