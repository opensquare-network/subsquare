import Link from "next-common/components/link";
import {
  PromptTypes,
  ScrollPromptItemWrapper,
} from "next-common/components/scrollPrompt";
import { CACHE_KEY } from "next-common/utils/constants";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import { useMemo, useState } from "react";
import { useChainSettings } from "next-common/context/chain";
import { useRouter } from "next/router";
import useIdentityInfo from "next-common/hooks/useIdentityInfo";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isEmpty } from "lodash-es";
import useMyJudgementRequest from "next-common/components/people/hooks/useMyJudgementRequest";
import RequestJudgementPopup from "next-common/components/requestJudgementPopup";

const identityPage = "/people";

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

function NavigateToJudgementPagePrompt() {
  return (
    <div>
      Actions is required to verify your identity social accounts.&nbsp;
      <Link className="underline text14Medium" href="/people/judgement">
        Go to Judgement page
      </Link>
      .
    </div>
  );
}

export default function useSetIdentityPrompt() {
  const router = useRouter();
  const chainSettings = useChainSettings();
  const address = useRealAddress();
  const { hasIdentity, identity } = useIdentityInfo(address);
  const pathName = router.pathname;
  const { modules } = chainSettings;
  const supportedPeople = modules?.people;

  const isPeoplePage = pathName?.startsWith(identityPage);

  const isNotVerified = useMemo(() => {
    return identity?.info?.status === "NOT_VERIFIED";
  }, [identity?.info?.status]);

  const cacheKey = useMemo(
    () =>
      isNotVerified
        ? CACHE_KEY.requestJudgementPrompt
        : CACHE_KEY.setIdentityPromptVisible,
    [isNotVerified],
  );

  const [visible, setVisible] = useCookieValue(cacheKey, true);

  const { value: myJudgementRequest, loading: isLoadingMyJudgementRequest } =
    useMyJudgementRequest();

  return useMemo(() => {
    if (!visible || !supportedPeople) {
      return {};
    }

    let message;
    if (hasIdentity && isNotVerified && isLoadingMyJudgementRequest === false) {
      if (myJudgementRequest) {
        message = <NavigateToJudgementPagePrompt />;
      } else {
        message = <RequestJudgementPromptContent />;
      }
    } else if (!hasIdentity && !isPeoplePage) {
      message = (
        <div>
          Set your on-chain identity&nbsp;
          <Link className="underline text14Medium" href={identityPage}>
            here
          </Link>
          .
        </div>
      );
    }

    if (message) {
      return {
        key: cacheKey,
        message,
        type: PromptTypes.INFO,
        close: () => setVisible(false, { expires: 15 }),
      };
    }

    return {};
  }, [
    cacheKey,
    hasIdentity,
    isNotVerified,
    isPeoplePage,
    setVisible,
    supportedPeople,
    visible,
    isLoadingMyJudgementRequest,
    myJudgementRequest,
  ]);
}
export function IdentityPrompt({ onClose }) {
  const prompt = useSetIdentityPrompt();
  if (isEmpty(prompt)) {
    return null;
  }
  return (
    <ScrollPromptItemWrapper
      prompt={{
        ...prompt,
        close: () => {
          onClose?.();
          prompt?.close();
        },
      }}
    />
  );
}
