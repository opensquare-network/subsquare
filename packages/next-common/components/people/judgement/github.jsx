import { LinkGithub } from "@osn/icons/subsquare";
import usePeopleJudgementSocialAuth from "./hooks/usePeopleJudgementSocialAuth";
import PeopleJudgementSocialConnect from "./socialConnect";
import { PeopleSocialType } from "./consts";

export default function Github({ request }) {
  const isVerified = request?.verifications?.github === true;

  const { loading, connected, openAuthWindow } = usePeopleJudgementSocialAuth({
    provider: PeopleSocialType.github,
    authUrlPath: "people/verifications/auth/github/auth-url",
    redirectPath: "/people/judgement/auth/github",
    isVerified,
  });

  return (
    <PeopleJudgementSocialConnect
      Icon={LinkGithub}
      title="GitHub"
      username={request?.info?.github}
      connected={connected}
      loading={loading}
      onConnect={openAuthWindow}
    />
  );
}
