import { isEmpty } from "lodash-es";
import {
  PromptTypes,
  ScrollPromptItemWrapper,
} from "next-common/components/scrollPrompt";
import { useIsWeb3User, useUser } from "next-common/context/user";
import { CACHE_KEY } from "next-common/utils/constants";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import Link from "next-common/components/link";
import { useMemo } from "react";

export default function useSetAvatarPrompt() {
  const isWeb3User = useIsWeb3User();
  const [visible, setVisible] = useCookieValue(
    CACHE_KEY.setAvatarPromptVisible,
    true,
  );
  const user = useUser();
  const hasAvatar = !!user?.avatarCid;

  return useMemo(() => {
    if (!isWeb3User || !visible || hasAvatar) {
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
      type: PromptTypes.INFO,
      close: () => setVisible(false, { expires: 15 }),
    };
  }, [setVisible, isWeb3User, visible, hasAvatar]);
}

export function AvatarPrompt({ onClose }) {
  const prompt = useSetAvatarPrompt();
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
