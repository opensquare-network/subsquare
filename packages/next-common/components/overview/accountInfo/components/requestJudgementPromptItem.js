import {
  PromptTypes,
  ScrollPromptItemWrapper,
} from "next-common/components/scrollPrompt";
import { CACHE_KEY } from "next-common/utils/constants";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import { useMemo, useState } from "react";
import { useIdentityInfoContext } from "next-common/context/people/identityInfoContext";
import RequestJudgementPopup from "next-common/components/requestJudgementPopup";

function analyzeJudgements(judgements) {
  return {
    hasPending: judgements.some(({ status }) => ["FeePaid"].includes(status)),
    hasPositive: judgements.some(({ status }) =>
      ["KnownGood", "Reasonable"].includes(status),
    ),
    hasOutdated: judgements.some(({ status }) => status === "OutOfDate"),
    hasNegative: judgements.some(({ status }) =>
      ["LowQuality", "Erroneous"].includes(status),
    ),
  };
}

function useShouldPromptJudgementRequest() {
  const { info, judgements, isLoading, displayName } = useIdentityInfoContext();

  if (isLoading) {
    return false;
  }

  if (!displayName && Object.values(info || {}).every((v) => !v)) {
    return false;
  }

  if (!judgements || judgements.length === 0) {
    return true;
  }

  const { hasPending, hasPositive, hasNegative } =
    analyzeJudgements(judgements);

  if (hasPending || hasPositive || hasNegative) {
    return false;
  }

  return true;
}

function RequestJudgementPromptContent() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      Your on-chain identity is not verified yet.&nbsp;
      <span
        role="button"
        className="cursor-pointer underline text14Medium"
        onClick={() => setShowPopup(true)}
      >
        Request judgement
      </span>
      {showPopup && (
        <RequestJudgementPopup onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
}

function useRequestJudgementPromptItem() {
  const shouldRequestJudgement = useShouldPromptJudgementRequest();

  const [visible, setVisible] = useCookieValue(
    CACHE_KEY.requestJudgementPrompt,
    true,
  );

  return useMemo(() => {
    if (!visible || !shouldRequestJudgement) {
      return {};
    }

    return {
      key: CACHE_KEY.requestJudgementPrompt,
      message: <RequestJudgementPromptContent />,
      type: PromptTypes.INFO,
      close: () => setVisible(false, { expires: 15 }),
    };
  }, [setVisible, shouldRequestJudgement, visible]);
}

export default function RequestJudgementPromptItem({ onClose }) {
  const prompt = useRequestJudgementPromptItem();

  if (!prompt?.message) {
    return null;
  }

  return (
    <ScrollPromptItemWrapper
      prompt={{
        ...prompt,
        close: () => {
          onClose?.();
          prompt?.close?.();
        },
      }}
    />
  );
}
