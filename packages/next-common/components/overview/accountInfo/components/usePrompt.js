import { useMemo } from "react";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";

export default function usePrompt(cacheKey, message, type) {
  const [visible, setVisible] = useCookieValue(cacheKey, true);

  return useMemo(() => {
    if (!visible) {
      return {};
    }

    return {
      key: cacheKey,
      message,
      type,
      close: () => setVisible(false, { expires: 15 }),
    };
  }, [cacheKey, message, type, setVisible, visible]);
}
