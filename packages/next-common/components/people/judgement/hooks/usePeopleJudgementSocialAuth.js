import { backendApi } from "next-common/services/nextApi";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { trimEndSlash } from "next-common/utils/url";
import { useCallback, useEffect, useState } from "react";
import { PEOPLE_JUDGEMENT_AUTH_MESSAGE_TYPE } from "next-common/components/people/judgement/consts";
import { useJudgementContext } from "../context";

function isJudgementAuthOpenerMessage(data, provider) {
  return (
    data?.type === PEOPLE_JUDGEMENT_AUTH_MESSAGE_TYPE &&
    data?.provider === provider
  );
}

export default function usePeopleJudgementSocialAuth({
  provider,
  authUrlPath,
  redirectPath,
  isVerified,
}) {
  const { fetchMyJudgementRequest } = useJudgementContext();
  const realAddress = useRealAddress();

  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(isVerified);

  useEffect(() => {
    setConnected(isVerified);
  }, [isVerified]);

  const getAuthLink = useCallback(async () => {
    if (!realAddress) {
      return "";
    }

    setLoading(true);
    try {
      const redirect = `${trimEndSlash(
        process.env.NEXT_PUBLIC_SITE_URL,
      )}${redirectPath}`;
      const { result } = await backendApi.fetch(
        `${authUrlPath}?who=${realAddress}&redirectUri=${redirect}`,
      );
      return result?.url || "";
    } finally {
      setLoading(false);
    }
  }, [authUrlPath, realAddress, redirectPath]);

  const openAuthWindow = useCallback(async () => {
    const link = await getAuthLink();
    if (!link) {
      return;
    }

    window.open(link);
  }, [getAuthLink]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      const data = event.data;
      if (!isJudgementAuthOpenerMessage(data, provider)) {
        return;
      }

      if (data?.ok && data?.who && data.who === realAddress) {
        setConnected(true);
        fetchMyJudgementRequest();
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [provider, realAddress, fetchMyJudgementRequest]);

  return {
    loading,
    connected,
    openAuthWindow,
  };
}
