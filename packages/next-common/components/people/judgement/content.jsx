import tw from "tailwind-styled-components";
import Loading from "next-common/components/loading";
import Discord from "./discord";
import Element from "./element";
import Email from "./email";
import Github from "./github";
import JudgementSummary from "./summary";
import Twitter from "./twitter";
import { useJudgementContext } from "./context";

const SocialAccountWrapper = tw.div`flex bg-neutral100 border-b border-neutral300 p-4 rounded-lg`;

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
              <SocialAccountWrapper>
                <Email request={request} />
              </SocialAccountWrapper>
            )}
            {request?.info?.matrix && (
              <SocialAccountWrapper>
                <Element request={request} />
              </SocialAccountWrapper>
            )}
            {request?.info?.discord && (
              <SocialAccountWrapper>
                <Discord request={request} />
              </SocialAccountWrapper>
            )}
            {request?.info?.twitter && (
              <SocialAccountWrapper>
                <Twitter request={request} />
              </SocialAccountWrapper>
            )}
            {request?.info?.github && (
              <SocialAccountWrapper>
                <Github request={request} />
              </SocialAccountWrapper>
            )}
          </>
        )}
      </div>
    </>
  );
}
