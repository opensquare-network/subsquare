import { useIsWeb3User } from "next-common/context/user";
import { CACHE_KEY } from "next-common/utils/constants";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import Link from "next/link";
import { useMemo } from "react";

export default function useSetAvatarPrompt() {
  const isWeb3User = useIsWeb3User();
  const [visible, setVisible] = useCookieValue(
    CACHE_KEY.setAvatarPromptVisible,
    true,
  );

  return useMemo(() => {
    if (!isWeb3User || !visible) {
      return {};
    }

    return {
      key: CACHE_KEY.setAvatarPromptVisible,
      message: (
        <div>
          Set an avatar to make you remarkable! Upload your image{" "}
          <Link className="underline" href={"/settings/key-account"}>
            here
          </Link>
        </div>
      ),
      close: () => setVisible(false, { expires: 15 }),
    };
  }, [setVisible, isWeb3User, visible]);
}
