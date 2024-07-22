import { PromptTypes } from "next-common/components/scrollPrompt";
import { ambassadorDemotionExpireRemindSelector } from "next-common/store/reducers/userPromptsSlice";
import { CACHE_KEY } from "next-common/utils/constants";
import Link from "next/link";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import usePrompt from "./usePrompt";

export default function useAmbassadorDemotionExpireRemindPrompt() {
  const message = useMemo(
    () => (
      <div>
        The demotion period of ambassador member is about to expire. Manage your
        member status{" "}
        <Link className="underline" href={"/ambassador/core"}>
          here
        </Link>
      </div>
    ),
    [],
  );

  const prompt = usePrompt(
    CACHE_KEY.ambassadorDemotionExpireRemindVisible,
    message,
    PromptTypes.WARNING,
  );

  const isAmbassadorDemotionExpireRemind = useSelector(
    ambassadorDemotionExpireRemindSelector,
  );

  return useMemo(() => {
    if (!isAmbassadorDemotionExpireRemind) {
      return {};
    }
    return prompt;
  }, [isAmbassadorDemotionExpireRemind, prompt]);
}
