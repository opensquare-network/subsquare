import { LinkDiscord } from "@osn/icons/subsquare";
import { ClosedTag } from "next-common/components/tags/state/styled";
import PrimaryButton from "next-common/lib/button/primary";
import { backendApi } from "next-common/services/nextApi";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { trimEndSlash } from "next-common/utils/url";
import { useCallback, useEffect, useState } from "react";
import { PEOPLE_JUDGEMENT_AUTH_MESSAGE_TYPE, PeopleSocialType } from "./consts";

function isDiscordOpenerMessage(data) {
  return (
    data?.type === PEOPLE_JUDGEMENT_AUTH_MESSAGE_TYPE &&
    data?.provider === PeopleSocialType.discord
  );
}

function useGetDiscordAuthLink() {
  const [loading, setLoading] = useState(false);
  const realAddress = useRealAddress();
  const getDiscordAuthLink = useCallback(async () => {
    if (!realAddress) {
      return "";
    }
    setLoading(true);
    try {
      const { result } = await backendApi.fetch(
        `people/judgement/auth/discord/auth-url?who=${realAddress}&redirectUri=${trimEndSlash(
          process.env.NEXT_PUBLIC_SITE_URL,
        )}/people/judgement/auth/discord`,
      );
      return result.url;
    } finally {
      setLoading(false);
    }
  }, [realAddress]);

  return {
    loading,
    getDiscordAuthLink,
  };
}

export default function Discord({ request }) {
  const { loading, getDiscordAuthLink } = useGetDiscordAuthLink();
  const realAddress = useRealAddress();

  const isVerified = request?.verification?.discord === true;

  const [connected, setConnected] = useState(isVerified);

  useEffect(() => {
    setConnected(isVerified);
  }, [isVerified]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      const data = event.data;
      if (!isDiscordOpenerMessage(data)) {
        return;
      }

      if (data?.ok && data?.who && data.who === realAddress) {
        setConnected(true);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [realAddress]);

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
            <ClosedTag>{connected ? "Connected" : "Pending"}</ClosedTag>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-4 pb-2">
        <div className="flex items-center ">
          <span className=" text14Bold w-32">Username:</span>
          <span className="truncate text-textTertiary">
            {request?.info?.discord}
          </span>
        </div>

        <PrimaryButton
          loading={loading}
          disabled={connected}
          onClick={async () => {
            const link = await getDiscordAuthLink();
            window.open(link);
          }}
          size="small"
        >
          Connect Discord
        </PrimaryButton>
      </div>
    </div>
  );
}
