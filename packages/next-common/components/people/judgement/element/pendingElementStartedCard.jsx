import { useState } from "react";
import { ClosedTag } from "next-common/components/tags/state/styled";
import PrimaryButton from "next-common/lib/button/primary";
import Input from "next-common/lib/input";
import Tooltip from "next-common/components/tooltip";
import ElementCardHeader from "./elementCardHeader";
import ElementAddressRow from "./elementAddressRow";
import ElementVerificationTips from "./elementVerificationTips";
import useFinishElementVerification from "./hooks/useFinishElementVerification";

export default function PendingElementStartedCard({
  request,
  elementAccount,
  verificationCode,
  onVerified,
}) {
  const [error, setError] = useState("");
  const who = request?.who || "";

  const { verifying, verify } = useFinishElementVerification({
    who,
    code: verificationCode,
    setError,
    onVerified: () => {
      onVerified?.();
    },
  });

  return (
    <div className="w-full space-y-2 text14Medium text-textPrimary">
      <ElementCardHeader
        tag={<ClosedTag>Pending</ClosedTag>}
        actions={
          <div className="flex gap-2 items-center">
            <Tooltip content="Click to confirm you have finished the verification">
              <PrimaryButton onClick={verify} loading={verifying} size="small">
                Confirm finished
              </PrimaryButton>
            </Tooltip>
          </div>
        }
      />

      <ElementAddressRow elementAccount={elementAccount} />

      <ElementVerificationTips />

      <div>
        <label className=" text14Bold mb-2 block">Verification Code</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input className="w-full" disabled={true} value={verificationCode} />
        </div>
        {error && <div className="mt-2 text12Medium text-red500">{error}</div>}
      </div>
    </div>
  );
}
