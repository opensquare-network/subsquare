import { useEffect, useState } from "react";
import PendingElementCard from "./pendingElementCard";
import VerifiedElementCard from "./verifiedElementCard";
import { useJudgementContext } from "../context";

export default function Element({ request }) {
  const { fetchMyJudgementRequest } = useJudgementContext();
  const elementAccount = request?.info?.matrix || "";
  const initialVerified = request?.verifications?.element === true;
  const [verified, setVerified] = useState(initialVerified);

  useEffect(() => {
    setVerified(initialVerified);
  }, [initialVerified]);

  if (verified) {
    return <VerifiedElementCard elementAccount={elementAccount} />;
  }

  return (
    <PendingElementCard
      request={request}
      elementAccount={elementAccount}
      onVerified={() => {
        setVerified(true);
        fetchMyJudgementRequest();
      }}
    />
  );
}
