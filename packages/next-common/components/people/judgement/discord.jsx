import { LinkDiscord } from "@osn/icons/subsquare";
import usePeopleJudgementSocialAuth from "./hooks/usePeopleJudgementSocialAuth";
import PeopleJudgementSocialConnect from "./socialConnect";
import { PeopleSocialType } from "./consts";

export default function Discord({ request }) {
  const isVerified = request?.verifications?.discord === true;
  const { loading, connected, openAuthWindow } = usePeopleJudgementSocialAuth({
    provider: PeopleSocialType.discord,
    authUrlPath: "people/verifications/auth/discord/auth-url",
    redirectPath: "/people/verifications/auth/discord",
    isVerified,
  });

  return (
    <PeopleJudgementSocialConnect
      icon={<LinkDiscord className="text-[#4f46e5]" />}
      title="Discord"
      username={request?.info?.discord}
      connected={connected}
      loading={loading}
      onConnect={openAuthWindow}
    />
  );
}
