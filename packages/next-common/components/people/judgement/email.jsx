import { LinkEmail } from "@osn/icons/subsquare";
import {
  ClosedTag,
  PositiveTag,
} from "next-common/components/tags/state/styled";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import Input from "next-common/lib/input";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import { useEnsureLogin } from "next-common/hooks/useEnsureLogin";
import { nextApi } from "next-common/services/nextApi";
import useCountdown from "next-common/hooks/useCountdown";

export default function Email({ request }) {
  const email = request?.info?.email || "";
  const initialVerified = request?.verification?.email === true;
  const [verified, setVerified] = useState(initialVerified);

  useEffect(() => {
    setVerified(initialVerified);
  }, [initialVerified]);

  if (verified) {
    return <VerifiedEmailCard email={email} />;
  }

  return (
    <PendingEmailCard
      request={request}
      email={email}
      onVerified={() => setVerified(true)}
    />
  );
}

function VerifiedEmailCard({ email }) {
  return (
    <div className="w-full space-y-2 text14Medium text-textPrimary">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <div className="flex text16Bold">
            <LinkEmail />
            <span className="text-textTertiary mx-1 ml-0">·</span>
            <h1>Email</h1>
          </div>
          <div>
            <PositiveTag>Verified</PositiveTag>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pb-2">
        <div className="flex items-center ">
          <span className=" text14Bold w-32">Email Address:</span>
          <span className="truncate text-textTertiary">{email}</span>
        </div>
      </div>
    </div>
  );
}

function PendingEmailCard({ request, email, onVerified }) {
  const [hasSent, setHasSent] = useState(false);

  const {
    countdown,
    start: startCountdown,
    stop: stopCountdown,
  } = useCountdown();

  if (!hasSent) {
    return (
      <PendingEmailNotSentCard
        request={request}
        email={email}
        onSent={() => {
          setHasSent(true);
          startCountdown(60);
        }}
      />
    );
  }

  return (
    <PendingEmailSentCard
      request={request}
      email={email}
      countdown={countdown}
      startCountdown={startCountdown}
      onVerified={() => {
        stopCountdown();
        onVerified?.();
      }}
    />
  );
}

function PendingEmailNotSentCard({ request, email, onSent }) {
  const [error, setError] = useState("");
  const who = request?.who || "";
  const { sending, sendCode } = useSendJudgementEmailCode({
    who,
    setError,
    onSent,
  });

  return (
    <div className="w-full space-y-2 text14Medium text-textPrimary">
      <EmailCardHeader
        tag={<ClosedTag>Pending</ClosedTag>}
        actions={
          <div className="flex gap-2 items-center">
            <SecondaryButton loading={sending} onClick={sendCode} size="small">
              Send code
            </SecondaryButton>
          </div>
        }
      />
      <EmailAddressRow email={email} />
      {error && <div className="text12Medium text-red500">{error}</div>}
    </div>
  );
}

function PendingEmailSentCard({
  request,
  email,
  countdown,
  startCountdown,
  onVerified,
}) {
  const [error, setError] = useState("");
  const who = request?.who || "";
  const [code, setCode] = useState("");
  const trimmedCode = useMemo(() => String(code || "").trim(), [code]);
  const canVerify = useMemo(() => Boolean(trimmedCode), [trimmedCode]);

  const { sending, sendCode } = useSendJudgementEmailCode({
    who,
    setError,
    onSent: () => {
      startCountdown(60);
    },
  });

  const { verifying, verifyCode } = useVerifyJudgementEmailCode({
    who,
    code: trimmedCode,
    setError,
    onVerified: () => {
      onVerified?.();
    },
  });

  return (
    <div className="w-full space-y-2 text14Medium text-textPrimary">
      <EmailCardHeader
        tag={<ClosedTag>Pending</ClosedTag>}
        actions={
          <div className="flex gap-2 items-center">
            <SecondaryButton
              loading={sending}
              onClick={sendCode}
              disabled={countdown > 0}
              size="small"
            >
              Resend{countdown > 0 ? ` ${countdown}s` : ""}
            </SecondaryButton>
            <PrimaryButton
              onClick={verifyCode}
              loading={verifying}
              disabled={!canVerify}
              size="small"
            >
              Start verify
            </PrimaryButton>
          </div>
        }
      />

      <EmailAddressRow email={email} />

      <EmailVerificationTips />

      <div>
        <label className=" text14Bold mb-2 block">
          Enter Verification Code
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            className="w-full"
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        {error && <div className="mt-2 text12Medium text-red500">{error}</div>}
      </div>
    </div>
  );
}

function EmailCardHeader({ tag, actions }) {
  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <div className="flex text16Bold">
          <LinkEmail />
          <span className="text-textTertiary mx-1 ml-0">·</span>
          <h1>Email</h1>
        </div>
        <div>{tag}</div>
      </div>
      {actions}
    </div>
  );
}

function EmailAddressRow({ email }) {
  return (
    <div className="flex gap-4 pb-2">
      <div className="flex items-center ">
        <span className=" text14Bold w-32">Email Address:</span>
        <span className="truncate text-textTertiary">{email}</span>
      </div>
    </div>
  );
}

function EmailVerificationTips() {
  return (
    <div className=" border bg-theme100 text-theme500 rounded-lg p-3">
      <p className=" text12Medium">
        <span className="text12Bold"> Tips:</span> We&lsquo;ve sent a 6-digit
        code to your email. Code expires in 10 minutes.
      </p>
    </div>
  );
}

function useSendJudgementEmailCode({ who, setError, onSent }) {
  const dispatch = useDispatch();
  const { ensureLogin } = useEnsureLogin();
  const [sending, setSending] = useState(false);

  const sendCode = useCallback(async () => {
    setError?.("");
    if (!who) {
      setError?.("Unable to determine who");
      return;
    }

    setSending(true);
    try {
      if (!(await ensureLogin())) {
        return;
      }

      const { error: sendError } = await nextApi.post(
        "people/judgement/auth/email/send-code",
        { who },
      );
      if (sendError) {
        const message = sendError.message || "Failed to send code";
        setError?.(message);
        dispatch(newErrorToast(message));
        return;
      }

      onSent?.();
      dispatch(newSuccessToast("Verification code sent"));
    } finally {
      setSending(false);
    }
  }, [dispatch, ensureLogin, onSent, setError, who]);

  return {
    sending,
    sendCode,
  };
}

function useVerifyJudgementEmailCode({ who, code, setError, onVerified }) {
  const dispatch = useDispatch();
  const { ensureLogin } = useEnsureLogin();
  const [verifying, setVerifying] = useState(false);

  const verifyCode = useCallback(async () => {
    setError?.("");
    if (!who) {
      setError?.("Unable to determine who");
      return;
    }

    if (!code) {
      setError?.("Code is required");
      return;
    }

    setVerifying(true);
    try {
      if (!(await ensureLogin())) {
        return;
      }

      const { error: verifyError } = await nextApi.post(
        "people/judgement/auth/email/verify-code",
        { who, code },
      );
      if (verifyError) {
        setError?.(verifyError.message || "Verification failed");
        return;
      }

      dispatch(newSuccessToast("Email verified"));
      onVerified?.();
    } finally {
      setVerifying(false);
    }
  }, [code, dispatch, ensureLogin, onVerified, setError, who]);

  return {
    verifying,
    verifyCode,
  };
}
