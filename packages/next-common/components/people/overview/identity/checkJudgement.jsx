import { useState, useCallback, useMemo } from "react";
import { useIdentityInfoContext } from "next-common/context/people/identityInfoContext";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { isIdentityEmpty } from "next-common/components/people/common";
import PrimaryButton from "next-common/lib/button/primary";
import { isEmpty } from "lodash-es";
import { useRouter } from "next/router";

const RequestJudgementPopup = dynamicPopup(
  () => import("next-common/components/requestJudgementPopup"),
  {
    ssr: false,
  },
);

// TODO: default subsquare registrar index.
const SUBSQUARE_REGISTRAR_INDEX = "2";

const VERIFIED_STATUSES = ["Reasonable", "KnownGood"];

function isPendingRequestBySubsquare(judgements) {
  return judgements?.some(
    (judgement) => judgement.index === SUBSQUARE_REGISTRAR_INDEX,
  );
}

function isVerifiedStatus(judgements) {
  return judgements?.some((judgement) =>
    VERIFIED_STATUSES.includes(judgement.status),
  );
}

function RequestJudgement() {
  const [showPopup, setShowPopup] = useState(false);
  const { info, isLoading } = useIdentityInfoContext();

  const isInfoEmpty = useMemo(() => isIdentityEmpty(info), [info]);

  const handleOpenPopup = useCallback(() => {
    setShowPopup(true);
  }, []);

  const handleClosePopup = useCallback(() => {
    setShowPopup(false);
  }, []);

  if (isLoading || isInfoEmpty) {
    return null;
  }

  return (
    <div>
      <PrimaryButton className="w-auto" onClick={handleOpenPopup}>
        Request Subsquare Judgement
      </PrimaryButton>
      {showPopup && <RequestJudgementPopup onClose={handleClosePopup} />}
    </div>
  );
}

function CheckSubsquareJudgement() {
  const router = useRouter();

  const handleCheckJudgement = useCallback(() => {
    router.push("/people/judgement");
  }, [router]);

  return (
    <div>
      <PrimaryButton className="w-auto" onClick={handleCheckJudgement}>
        Check Your Judgement
      </PrimaryButton>
    </div>
  );
}

export default function CheckJudgement() {
  const { judgements, isLoading } = useIdentityInfoContext();
  if (isLoading) {
    return null;
  }

  if (isEmpty(judgements)) {
    return <RequestJudgement />;
  }

  if (isVerifiedStatus(judgements)) {
    return null;
  }

  if (isPendingRequestBySubsquare(judgements)) {
    return <CheckSubsquareJudgement />;
  }

  return <RequestJudgement />;
}
