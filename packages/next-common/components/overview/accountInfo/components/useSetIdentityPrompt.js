import Link from "next/link";
import { PromptTypes } from "next-common/components/scrollPrompt";
import { CACHE_KEY } from "next-common/utils/constants";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import { useMemo } from "react";
import { useChainSettings } from "next-common/context/chain";
import { useRouter } from "next/router";
import useIdentityInfo from "next-common/hooks/useIdentityInfo";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

const identityPage = "/people";
const judgementPage = "/people?tab=judgements";

export default function useSetIdentityPrompt() {
  const router = useRouter();
  const chainSettings = useChainSettings();
  const address = useRealAddress();
  const { hasIdentity, identity } = useIdentityInfo(address);
  const pathName = router.pathname;
  const { modules } = chainSettings;
  const supportedPeople = modules?.people;

  const isPeoplePage = pathName?.startsWith(identityPage);
  const isJudgementPage = router.asPath?.startsWith(judgementPage);

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

  return useMemo(() => {
    if (!visible || !supportedPeople) {
      return {};
    }
    let message;
    if (hasIdentity && isNotVerified && !isJudgementPage) {
      message = (
        <div>
          Your on-chain identity has not been verified yet, request registrar to
          judge it{" "}
          <Link className="underline text14Medium" href={judgementPage}>
            here
          </Link>
          .
        </div>
      );
    } else if (!hasIdentity && !isPeoplePage) {
      message = (
        <div>
          Set your personalized on-chain identity! Manage it{" "}
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
    isJudgementPage,
    isNotVerified,
    isPeoplePage,
    setVisible,
    supportedPeople,
    visible,
  ]);
}
