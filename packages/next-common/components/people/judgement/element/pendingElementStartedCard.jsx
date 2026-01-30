import { useState } from "react";
import { WarningTag } from "next-common/components/tags/state/styled";
import SecondaryButton from "next-common/lib/button/secondary";
import Tooltip from "next-common/components/tooltip";
import ElementCardHeader from "./elementCardHeader";
import ElementAddressRow from "./elementAccountRow";
import ElementVerificationTips from "./elementVerificationTips";
import useFinishElementVerification from "./hooks/useFinishElementVerification";
import Copyable from "next-common/components/copyable";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";

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
        tag={<WarningTag>Pending</WarningTag>}
        actions={
          <div className="flex gap-2 items-center">
            <Tooltip content="Click to confirm you have finished the verification">
              <SecondaryButton
                onClick={verify}
                loading={verifying}
                size="small"
              >
                Confirm finished
              </SecondaryButton>
            </Tooltip>
          </div>
        }
      />

      <ElementAddressRow elementAccount={elementAccount} />

      <ElementVerificationTips />

      <div>
        <label className=" text14Bold mb-2 block">Verification Code</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <GreyPanel className="w-full text14Medium text-textPrimary px-3 py-2 border border-neutral400">
            <Copyable>{verificationCode}</Copyable>
          </GreyPanel>
        </div>
        {error && <div className="mt-2 text12Medium text-red500">{error}</div>}
      </div>
    </div>
  );
}
