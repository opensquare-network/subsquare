import {
  PromptTypes,
  ScrollPromptItemWrapper,
} from "next-common/components/scrollPrompt";
import { CACHE_KEY } from "next-common/utils/constants";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import Link from "next-common/components/link";
import { useMemo } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useMyInheritor from "next-common/components/recovery/myRecovery/hooks/useMyInheritor";
import { isEmpty } from "lodash-es";

function useRecoveryInheritorPrompt() {
  const address = useRealAddress();
  const { data, loading } = useMyInheritor(address);
  const [visible, setVisible] = useCookieValue(
    CACHE_KEY.recoveryInheritorPrompt,
    true,
  );
  const hasInheritor = !loading && data?.length > 0;

  return useMemo(() => {
    if (!hasInheritor || !visible) {
      return {};
    }

    return {
      key: CACHE_KEY.recoveryInheritorPrompt,
      message: (
        <div>
          You have inheritor settings. See details{" "}
          <Link className="underline" href="/account/my-recovery">
            here
          </Link>
        </div>
      ),
      type: PromptTypes.WARNING,
      close: () => setVisible(false, { expires: 15 }),
    };
  }, [hasInheritor, visible, setVisible]);
}

export default function RecoveryInheritorPrompt({ onClose }) {
  const prompt = useRecoveryInheritorPrompt();
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
