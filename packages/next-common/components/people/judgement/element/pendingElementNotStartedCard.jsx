import { useState } from "react";
import { WarningTag } from "next-common/components/tags/state/styled";
import SecondaryButton from "next-common/lib/button/secondary";
import ElementCardHeader from "./elementCardHeader";
import ElementAccountRow from "./elementAccountRow";
import useStartElementVerification from "./hooks/useStartElementVerification";
import Tooltip from "next-common/components/tooltip";

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
        tag={<WarningTag>Pending</WarningTag>}
        actions={
          <div className="flex gap-2 items-center">
            <Tooltip content="Start verifying your Element account">
              <SecondaryButton
                loading={starting}
                onClick={startVerify}
                size="small"
              >
                Start verify
              </SecondaryButton>
            </Tooltip>
          </div>
        }
      />
      <ElementAccountRow elementAccount={elementAccount} />
      {error && <div className="text12Medium text-red500">{error}</div>}
    </div>
  );
}
