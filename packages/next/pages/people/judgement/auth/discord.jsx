import ListLayout from "next-common/components/layout/ListLayout";
import generateLayoutRawTitle from "next-common/utils/generateLayoutRawTitle";
import Account from "next-common/components/account";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { PeopleGlobalProvider } from "../../index";
import { CHAIN } from "next-common/utils/constants";
import { withCommonProps } from "next-common/lib";
import getChainSettings from "next-common/utils/consts/settings";
import PrimaryButton from "next-common/lib/button/primary";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { backendApi } from "next-common/services/nextApi";
import {
  PEOPLE_JUDGEMENT_AUTH_MESSAGE_TYPE,
  PeopleSocialType,
} from "next-common/components/people/judgement/consts";

const isPeopleSupported = !!getChainSettings(CHAIN).modules?.people;

function notifyOpener(payload) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.opener?.postMessage(payload, window.location.origin);
  } catch (e) {
    // ignore
  }
}

function useCloseCountdown(seconds, enabled) {
  const [time, setTime] = useState(seconds);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          try {
            window.close();
          } catch (e) {
            // ignore
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [enabled]);

  return time;
}

function useNotifyOpenerOnResult(result) {
  useEffect(() => {
    if (!result) return;

    notifyOpener({
      type: PEOPLE_JUDGEMENT_AUTH_MESSAGE_TYPE,
      provider: PeopleSocialType.discord,
      ok: !!result.success,
      who: result.who,
      message: result.message,
      ts: Date.now(),
    });
  }, [result]);
}

function useDiscordAuthVerifyResult({ code, state }) {
  const [result, setResult] = useState(null);
  const hasRequestedRef = useRef(false);

  useEffect(() => {
    if (hasRequestedRef.current) {
      return;
    }

    hasRequestedRef.current = true;

    if (!code || !state) {
      setResult({ success: false, message: "Missing code or state" });
      return;
    }

    let cancelled = false;
    (async () => {
      const { result, error } = await backendApi.fetch(
        "people/judgement/auth/discord/callback",
        { code, state },
      );

      if (cancelled) {
        return;
      }

      if (error) {
        setResult({
          success: false,
          message: error.message || "Verification failed",
        });
        return;
      }

      setResult({
        success: true,
        who: result?.who,
        message: "Verify success",
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [code, state]);

  return result;
}

function DiscordAuthSuccess({ time }) {
  return (
    <p className=" text-center py-4 text-theme300  text14Medium">
      Verification successful! This window will close in {time} seconds…
    </p>
  );
}

function DiscordAuthFailed({ message, time }) {
  return (
    <p className="text-center py-4 text-theme300  text14Medium">
      {message ? message : "Verify Your Discord Account Failed"}
      {time > 0 ? ` (closing in ${time}s…)` : ""}
    </p>
  );
}

function DiscordAuthLayout({ children }) {
  const address = useRealAddress();
  return (
    <PeopleGlobalProvider>
      <ListLayout
        title="Subsquare Judgement Verify"
        seoInfo={{
          rawTitle: generateLayoutRawTitle(
            "Subsquare verify your Discord account",
          ),
        }}
        description={"Subsquare verify your Discord account"}
        headContent={
          <>
            <div className="pb-3 flex gap-2">
              <Account account={{ address }} addressClassName="!text14Medium" />
            </div>
          </>
        }
      >
        {children}
      </ListLayout>
    </PeopleGlobalProvider>
  );
}

function DiscordAuthResultCard({ result, time }) {
  return (
    <div className=" bg-neutral100 border-b border-neutral300 p-4 rounded-lg  space-y-3">
      {result === null ? (
        <p className=" text-center py-4 text-theme300  text14Medium">
          Verifying your Discord account…
        </p>
      ) : result?.success ? (
        <DiscordAuthSuccess time={time} />
      ) : (
        <DiscordAuthFailed message={result?.message} time={time} />
      )}
      <div className="flex justify-end">
        <Link href="/people/judgement">
          <PrimaryButton>Go to Judgement Detail</PrimaryButton>
        </Link>
      </div>
    </div>
  );
}

function DiscordAuthErrorFlow({ error, errorDescription }) {
  const message =
    error === "access_denied"
      ? "Authorization cancelled"
      : `OAuth error: ${error}`;
  const result = {
    success: false,
    who: "",
    message: errorDescription ? `${message}: ${errorDescription}` : message,
  };

  useNotifyOpenerOnResult(result);
  const time = useCloseCountdown(5, true);

  return (
    <DiscordAuthLayout>
      <DiscordAuthResultCard result={result} time={time} />
    </DiscordAuthLayout>
  );
}

function DiscordAuthVerifyFlow({ code, state }) {
  const result = useDiscordAuthVerifyResult({ code, state });
  useNotifyOpenerOnResult(result);
  const time = useCloseCountdown(5, result !== null);

  return (
    <DiscordAuthLayout>
      <DiscordAuthResultCard result={result} time={time} />
    </DiscordAuthLayout>
  );
}

export default function Page({ code, state, error, errorDescription }) {
  if (error) {
    return (
      <DiscordAuthErrorFlow error={error} errorDescription={errorDescription} />
    );
  }

  return <DiscordAuthVerifyFlow code={code} state={state} />;
}

export const getServerSideProps = async (ctx) => {
  if (!isPeopleSupported) {
    return {
      notFound: true,
    };
  }

  const code = ctx.query.code || "";
  const state = ctx.query.state || "";
  const error = ctx.query.error || "";
  const errorDescription = ctx.query.error_description || "";

  return withCommonProps(async () => {
    return {
      props: {
        code,
        state,
        error,
        errorDescription,
      },
    };
  })(ctx);
};
