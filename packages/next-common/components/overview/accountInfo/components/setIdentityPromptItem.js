import Link from "next-common/components/link";
import {
  PromptTypes,
  ScrollPromptItemWrapper,
} from "next-common/components/scrollPrompt";
import { CACHE_KEY } from "next-common/utils/constants";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import { useMemo } from "react";
import { useChainSettings } from "next-common/context/chain";
import { useRouter } from "next/router";
import useIdentityInfo from "next-common/hooks/useIdentityInfo";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

const identityPage = "/people";

function useSetIdentityPromptItem() {
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

  const shouldShow = !hasIdentity && !isPeoplePage;

  const [visible, setVisible] = useCookieValue(
    CACHE_KEY.setIdentityPromptVisible,
    true,
  );

  return useMemo(() => {
    if (!visible || !supportedPeople || !shouldShow || isNotVerified) {
      return {};
    }

    return {
      key: CACHE_KEY.setIdentityPromptVisible,
      message: (
        <div>
          Set your on-chain identity&nbsp;
          <Link className="underline text14Medium" href={identityPage}>
            here
          </Link>
          .
        </div>
      ),
      type: PromptTypes.INFO,
      close: () => setVisible(false, { expires: 15 }),
    };
  }, [isNotVerified, setVisible, shouldShow, supportedPeople, visible]);
}

export default function SetIdentityPromptItem({ onClose }) {
  const prompt = useSetIdentityPromptItem();

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
