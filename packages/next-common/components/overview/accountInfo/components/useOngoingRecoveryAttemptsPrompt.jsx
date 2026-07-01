import {
  PromptTypes,
  ScrollPromptItemWrapper,
} from "next-common/components/scrollPrompt";
import { CACHE_KEY } from "next-common/utils/constants";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import Link from "next-common/components/link";
import { useMemo } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useMyRecoveryAttempts from "next-common/components/recovery/myRecovery/hooks/useMyRecoveryAttempts";
import { isEmpty } from "lodash-es";

function useOngoingRecoveryAttemptsPrompt() {
  const address = useRealAddress();
  const { data, loading } = useMyRecoveryAttempts(address);
  const [visible, setVisible] = useCookieValue(
    CACHE_KEY.ongoingRecoveryAttemptsPrompt,
    true,
  );
  const hasAttempts = !loading && data?.length > 0;

  return useMemo(() => {
    if (!hasAttempts || !visible) {
      return {};
    }

    return {
      key: CACHE_KEY.ongoingRecoveryAttemptsPrompt,
      message: (
        <div>
          You have ongoing recovery attempts. See details{" "}
          <Link className="underline" href="/account/my-recovery">
            here
          </Link>
        </div>
      ),
      type: PromptTypes.WARNING,
      close: () => setVisible(false, { expires: 15 }),
    };
  }, [hasAttempts, visible, setVisible]);
}

export default function OngoingRecoveryAttemptsPrompt({ onClose }) {
  const prompt = useOngoingRecoveryAttemptsPrompt();
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
