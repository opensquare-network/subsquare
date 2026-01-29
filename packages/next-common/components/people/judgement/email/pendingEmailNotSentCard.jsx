import { useState } from "react";
import { WarningTag } from "next-common/components/tags/state/styled";
import SecondaryButton from "next-common/lib/button/secondary";
import EmailCardHeader from "./emailCardHeader";
import EmailAddressRow from "./emailAddressRow";
import useSendJudgementEmailCode from "./hooks/useSendJudgementEmailCode";
import Tooltip from "next-common/components/tooltip";

export default function PendingEmailNotSentCard({ request, email, onSent }) {
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
        tag={<WarningTag>Pending</WarningTag>}
        actions={
          <div className="flex gap-2 items-center">
            <Tooltip content="Click to send verification code to your mailbox">
              <SecondaryButton
                loading={sending}
                onClick={sendCode}
                size="small"
              >
                Send code
              </SecondaryButton>
            </Tooltip>
          </div>
        }
      />
      <EmailAddressRow email={email} />
      {error && <div className="text12Medium text-red500">{error}</div>}
    </div>
  );
}
