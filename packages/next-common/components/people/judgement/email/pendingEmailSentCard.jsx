import { useState } from "react";
import { ClosedTag } from "next-common/components/tags/state/styled";
import PrimaryButton from "next-common/lib/button/primary";
import SecondaryButton from "next-common/lib/button/secondary";
import Input from "next-common/lib/input";
import EmailCardHeader from "./emailCardHeader";
import EmailAddressRow from "./emailAddressRow";
import EmailVerificationTips from "./emailVerificationTips";
import useSendJudgementEmailCode from "./hooks/useSendJudgementEmailCode";
import useVerifyJudgementEmailCode from "./hooks/useVerifyJudgementEmailCode";

export default function PendingEmailSentCard({
  request,
  email,
  countdown,
  startCountdown,
  onVerified,
}) {
  const [error, setError] = useState("");
  const who = request?.who || "";
  const [code, setCode] = useState("");
  const trimmedCode = String(code || "").trim();
  const canVerify = Boolean(trimmedCode);

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
