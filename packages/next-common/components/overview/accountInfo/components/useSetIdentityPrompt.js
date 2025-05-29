import Link from "next/link";
import { PromptTypes } from "next-common/components/scrollPrompt";
import { CACHE_KEY } from "next-common/utils/constants";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import { useMemo } from "react";
import { useChainSettings } from "next-common/context/chain";
import { useRouter } from "next/router";

const identityPage = "/people";

export default function useSetIdentityPrompt() {
  const router = useRouter();
  const chainSettings = useChainSettings();
  const pathName = router.pathname;
  const { modules } = chainSettings;
  const supportedPeople = modules?.people;

  const isPeoplePage = pathName?.startsWith(identityPage);

  const [visible, setVisible] = useCookieValue(
    CACHE_KEY.setIdentityPromptVisible,
    true,
  );

  return useMemo(() => {
    if (!visible || !supportedPeople || isPeoplePage) {
      return {};
    }

    return {
      key: CACHE_KEY.setIdentityPromptVisible,
      message: (
        <div>
          Set your personalized on-chain identity! Manage it{" "}
          <Link
            className="underline text14Medium font-bold"
            href={identityPage}
          >
            here
          </Link>
          .
        </div>
      ),
      type: PromptTypes.INFO,
      close: () => setVisible(false, { expires: 15 }),
    };
  }, [setVisible, visible, supportedPeople, isPeoplePage]);
}
