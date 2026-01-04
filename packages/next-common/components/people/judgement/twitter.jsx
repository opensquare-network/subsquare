import { LinkTwitter } from "@osn/icons/subsquare";
import { ClosedTag } from "next-common/components/tags/state/styled";
import PrimaryButton from "next-common/lib/button/primary";
import { useMemo } from "react";

const scope = "tweet.read users.read offline.access";
const client_id = process.env.NEXT_PUBLIC_X_CLIENT_ID;
const redirect_uri = location.origin + "/people/judgement/auth/twitter";

function generateAuthLink(state = {}) {
  const params = new URLSearchParams({
    state: encodeURIComponent(JSON.stringify(state)),
    client_id,
    redirect_uri,
    scope,
    response_type: "code",
    code_challenge: "challenge",
    code_challenge_method: "plain",
  });

  return `https://x.com/i/oauth2/authorize?${params}`;
}

export default function Twitter() {
  const link = useMemo(() => generateAuthLink(), []);
  return (
    <div className="w-full space-y-2 text14Medium text-textPrimary">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <div className="flex text16Bold">
            <LinkTwitter className="text-[#4f46e5]" />
            <span className="text-textTertiary mx-1 ml-0">·</span>
            <h1>Twitter</h1>
          </div>
          <div>
            <ClosedTag>Pending</ClosedTag>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-4 pb-2">
        <div className="flex items-center ">
          <span className=" text14Bold w-32">Username:</span>
          <span className="truncate text-textTertiary">@QuinnGao</span>
        </div>
        <PrimaryButton size="small" onClick={() => window.open(link)}>
          Connect Twitter
        </PrimaryButton>
      </div>
    </div>
  );
}
