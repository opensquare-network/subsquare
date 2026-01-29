import ListLayout from "next-common/components/layout/ListLayout";
import Account from "next-common/components/account";
import generateLayoutRawTitle from "next-common/utils/generateLayoutRawTitle";
import PrimaryButton from "next-common/lib/button/primary";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { backendApi } from "next-common/services/nextApi";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PEOPLE_JUDGEMENT_AUTH_MESSAGE_TYPE } from "next-common/components/people/judgement/consts";

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

function useNotifyOpenerOnResult({ provider, result }) {
  useEffect(() => {
    if (!result) return;

    notifyOpener({
      type: PEOPLE_JUDGEMENT_AUTH_MESSAGE_TYPE,
      provider,
      ok: !!result.success,
      who: result.who,
      message: result.message,
      ts: Date.now(),
    });
  }, [provider, result]);
}

function useAuthVerifyResult({ code, state, backendCallbackPath }) {
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
      const { result, error } = await backendApi.fetch(backendCallbackPath, {
        code,
        state,
      });

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
  }, [backendCallbackPath, code, state]);

  return result;
}

function AuthSuccess({ time }) {
  return (
    <p className=" text-center py-4 text-theme300  text14Medium">
      Verification successful! This window will close in {time} seconds…
    </p>
  );
}

function AuthFailed({ message, time, providerLabel }) {
  return (
    <p className="text-center py-4 text-theme300  text14Medium">
      {message ? message : `Verify Your ${providerLabel} Account Failed`}
      {time > 0 ? ` (closing in ${time}s…)` : ""}
    </p>
  );
}

function AuthLayout({ providerLabel, children }) {
  const address = useRealAddress();

  return (
    <ListLayout
      title="Subsquare Judgement Verify"
      seoInfo={{
        rawTitle: generateLayoutRawTitle(
          `Subsquare verify your ${providerLabel} account`,
        ),
      }}
      description={`Subsquare verify your ${providerLabel} account`}
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
  );
}

function AuthResultCard({ providerLabel, result, time }) {
  return (
    <div className=" bg-neutral100 border-b border-neutral300 p-4 rounded-lg  space-y-3">
      {result === null ? (
        <p className=" text-center py-4 text-theme300  text14Medium">
          Verifying your {providerLabel} account…
        </p>
      ) : result?.success ? (
        <AuthSuccess time={time} />
      ) : (
        <AuthFailed
          providerLabel={providerLabel}
          message={result?.message}
          time={time}
        />
      )}
      <div className="flex justify-end">
        <Link href="/people/verifications">
          <PrimaryButton>Go to Judgement Detail</PrimaryButton>
        </Link>
      </div>
    </div>
  );
}

function AuthErrorFlow({ provider, providerLabel, error, errorDescription }) {
  const message =
    error === "access_denied"
      ? "Authorization cancelled"
      : `OAuth error: ${error}`;

  const result = {
    success: false,
    who: "",
    message: errorDescription ? `${message}: ${errorDescription}` : message,
  };

  useNotifyOpenerOnResult({ provider, result });
  const time = useCloseCountdown(5, true);

  return (
    <AuthLayout providerLabel={providerLabel}>
      <AuthResultCard
        providerLabel={providerLabel}
        result={result}
        time={time}
      />
    </AuthLayout>
  );
}

function AuthVerifyFlow({
  provider,
  providerLabel,
  backendCallbackPath,
  code,
  state,
}) {
  const result = useAuthVerifyResult({ code, state, backendCallbackPath });
  useNotifyOpenerOnResult({ provider, result });
  const time = useCloseCountdown(5, result !== null);

  return (
    <AuthLayout providerLabel={providerLabel}>
      <AuthResultCard
        providerLabel={providerLabel}
        result={result}
        time={time}
      />
    </AuthLayout>
  );
}

export default function PeopleJudgementAuthCallbackPage({
  provider,
  providerLabel,
  backendCallbackPath,
  code,
  state,
  error,
  errorDescription,
}) {
  if (error) {
    return (
      <AuthErrorFlow
        provider={provider}
        providerLabel={providerLabel}
        error={error}
        errorDescription={errorDescription}
      />
    );
  }

  return (
    <AuthVerifyFlow
      provider={provider}
      providerLabel={providerLabel}
      backendCallbackPath={backendCallbackPath}
      code={code}
      state={state}
    />
  );
}
