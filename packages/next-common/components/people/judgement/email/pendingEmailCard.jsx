import { useState } from "react";
import useCountdown from "next-common/hooks/useCountdown";
import PendingEmailNotSentCard from "./pendingEmailNotSentCard";
import PendingEmailSentCard from "./pendingEmailSentCard";

export default function PendingEmailCard({ request, email, onVerified }) {
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
