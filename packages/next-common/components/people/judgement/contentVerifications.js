import tw from "tailwind-styled-components";
import Discord from "./discord";
import Element from "./element";
import Email from "./email";
import Github from "./github";
import JudgementSummary from "./summary";
import Twitter from "./twitter";
import { PeopleSocialType } from "./consts";

const SocialAccountWrapper = tw.div`flex bg-neutral100 border-b border-neutral300 p-4 rounded-lg`;

function calcVerificationNumbers(request) {
  const allSocialTypes = Object.values(PeopleSocialType);
  const info = request?.info || {};
  const verifications = request?.verifications || {};
  const totalSocials = allSocialTypes.filter((key) =>
    Boolean(info[key === "element" ? "matrix" : key]),
  ).length;
  const verified = allSocialTypes.filter(
    (key) =>
      Boolean(info[key === "element" ? "matrix" : key]) &&
      verifications?.[key] === true,
  ).length;
  const pending = totalSocials - verified;
  return { verified, pending };
}

export default function ContentVerifications({ request }) {
  const { verified, pending } = calcVerificationNumbers(request);

  return (
    <>
      <JudgementSummary verified={verified} pending={pending} />
      <div className="pt-4 grid grid-cols-1 gap-4 text-textPrimary">
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
      </div>
    </>
  );
}
