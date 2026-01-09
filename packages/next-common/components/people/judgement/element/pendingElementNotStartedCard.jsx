import { useState } from "react";
import { ClosedTag } from "next-common/components/tags/state/styled";
import SecondaryButton from "next-common/lib/button/secondary";
import ElementCardHeader from "./elementCardHeader";
import ElementAccountRow from "./elementAddressRow";
import useStartElementVerification from "./hooks/useStartElementVerification";

export default function PendingElementNotStartedCard({
  request,
  elementAccount,
  onStarted,
}) {
  const [error, setError] = useState("");
  const who = request?.who || "";

  const { starting, startVerify } = useStartElementVerification({
    who,
    setError,
    onStarted,
  });

  return (
    <div className="w-full space-y-2 text14Medium text-textPrimary">
      <ElementCardHeader
        tag={<ClosedTag>Pending</ClosedTag>}
        actions={
          <div className="flex gap-2 items-center">
            <SecondaryButton
              loading={starting}
              onClick={startVerify}
              size="small"
            >
              Start verify
            </SecondaryButton>
          </div>
        }
      />
      <ElementAccountRow elementAccount={elementAccount} />
      {error && <div className="text12Medium text-red500">{error}</div>}
    </div>
  );
}
