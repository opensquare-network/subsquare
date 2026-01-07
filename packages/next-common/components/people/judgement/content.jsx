import Loading from "next-common/components/loading";
import useMyJudgementRequest from "../hooks/useMyJudgementRequest";
import Discord from "./discord";
import Element from "./element";
import Email from "./email";
import Github from "./github";
import JudgementSummary from "./summary";
import Twitter from "./twitter";

export default function JudgementPageContent() {
  const { value, loading: isLoadingMyJudgementRequest } =
    useMyJudgementRequest();

  const request = value?.items[0] || null;

  return (
    <>
      <JudgementSummary request={request} />
      <div className="pt-4 grid grid-cols-1 gap-4">
        {isLoadingMyJudgementRequest && !request ? (
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
            {request?.info?.element && (
              <div className="bg-neutral100 border-b border-neutral300 p-4 rounded-lg flex">
                <Element />
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
