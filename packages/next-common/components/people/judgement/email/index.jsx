import { useEffect, useState } from "react";
import PendingEmailCard from "./pendingEmailCard";
import VerifiedEmailCard from "./verifiedEmailCard";
import { useJudgementContext } from "../context";

export default function Email({ request }) {
  const { fetchMyJudgementRequest } = useJudgementContext();
  const email = request?.info?.email || "";
  const initialVerified = request?.verifications?.email === true;
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
      onVerified={() => {
        setVerified(true);
        fetchMyJudgementRequest();
      }}
    />
  );
}
