import { LinkTwitter } from "@osn/icons/subsquare";
import usePeopleJudgementSocialAuth from "./hooks/usePeopleJudgementSocialAuth";
import PeopleJudgementSocialConnect from "./socialConnect";
import { PeopleSocialType } from "./consts";

export default function Twitter({ request }) {
  const isVerified = request?.verifications?.twitter === true;

  const { loading, connected, openAuthWindow } = usePeopleJudgementSocialAuth({
    provider: PeopleSocialType.twitter,
    authUrlPath: "people/judgement/auth/twitter/auth-url",
    redirectPath: "/people/judgement/auth/twitter",
    isVerified,
  });

  return (
    <PeopleJudgementSocialConnect
      icon={<LinkTwitter className="text-[#4f46e5]" />}
      title="Twitter"
      username={request?.info?.twitter}
      connected={connected}
      loading={loading}
      onConnect={openAuthWindow}
    />
  );
}
