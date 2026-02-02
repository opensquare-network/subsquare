import { useState } from "react";
import PendingElementNotStartedCard from "./pendingElementNotStartedCard";
import PendingElementStartedCard from "./pendingElementStartedCard";

export default function PendingElementCard({
  request,
  elementAccount,
  onVerified,
}) {
  const isVerifying = request?.verifications?.element?.verifying === true;
  const verifyingCode = request?.verifications?.element?.code || "";
  const [code, setCode] = useState(verifyingCode);
  const [hasStarted, setHasStarted] = useState(isVerifying);

  if (!hasStarted) {
    return (
      <PendingElementNotStartedCard
        request={request}
        elementAccount={elementAccount}
        onStarted={(verificationCode) => {
          setCode(verificationCode);
          setHasStarted(true);
        }}
      />
    );
  }

  return (
    <PendingElementStartedCard
      request={request}
      elementAccount={elementAccount}
      verificationCode={code}
      onVerified={() => {
        onVerified?.();
      }}
    />
  );
}
