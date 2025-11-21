import { LinkDiscord } from "@osn/icons/subsquare";
import { ClosedTag } from "next-common/components/tags/state/styled";
import PrimaryButton from "next-common/lib/button/primary";
import { useMemo } from "react";

function generateDiscordAuthLink(state = {}) {
  const client_id = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
  const redirect_uri = location.origin + "/people/judgement/auth/discord";

  const params = new URLSearchParams({
    client_id,
    redirect_uri,
    response_type: "code",
    scope: "identify",
    state: encodeURIComponent(JSON.stringify(state)),
  });

  return `https://discord.com/oauth2/authorize?${params.toString()}`;
}

export default function Discord() {
  const link = useMemo(() => generateDiscordAuthLink(), []);
  return (
    <div className="w-full space-y-2 text14Medium text-textPrimary">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <div className="flex text16Bold">
            <LinkDiscord className="text-[#4f46e5]" />
            <span className="text-textTertiary mx-1 ml-0">·</span>
            <h1>Discord</h1>
          </div>
          <div>
            <ClosedTag>Pending</ClosedTag>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-4 pb-2">
        <div className="flex items-center ">
          <span className=" text14Bold w-32">Username:</span>
          <span className="truncate text-textTertiary">
            pending@example.com
          </span>
        </div>
        <a href={link}>
          <PrimaryButton size="small">Connect Discord</PrimaryButton>
        </a>
      </div>
    </div>
  );
}
