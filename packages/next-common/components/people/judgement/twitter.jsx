import { LinkTwitter } from "@osn/icons/subsquare";
import usePeopleJudgementSocialAuth from "./hooks/usePeopleJudgementSocialAuth";
import PeopleJudgementSocialConnect from "./socialConnect";
import { PeopleSocialType } from "./consts";

export default function Twitter({ request }) {
  const isVerified = request?.verifications?.twitter === true;

  const { loading, connected, openAuthWindow } = usePeopleJudgementSocialAuth({
    provider: PeopleSocialType.twitter,
    authUrlPath: "people/verifications/auth/twitter/auth-url",
    redirectPath: "/people/verifications/auth/twitter",
    isVerified,
  });

  return (
    <PeopleJudgementSocialConnect
      Icon={LinkTwitter}
      title="Twitter"
      username={request?.info?.twitter}
      connected={connected}
      loading={loading}
      onConnect={openAuthWindow}
    />
  );
}
