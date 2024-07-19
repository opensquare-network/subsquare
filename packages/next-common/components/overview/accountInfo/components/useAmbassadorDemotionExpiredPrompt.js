import { PromptTypes } from "next-common/components/scrollPrompt";
import { ambassadorDemotionExpiredSelector } from "next-common/store/reducers/userPromptsSlice";
import { CACHE_KEY } from "next-common/utils/constants";
import Link from "next/link";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import usePrompt from "./usePrompt";

export default function useAmbassadorDemotionExpiredPrompt() {
  const message = useMemo(
    () => (
      <div>
        The demotion period of ambassador member is expired. Manage your member
        status{" "}
        <Link className="underline" href={"/ambassador/core"}>
          here
        </Link>
      </div>
    ),
    [],
  );

  const prompt = usePrompt(
    CACHE_KEY.ambassadorDemotionExpiredVisible,
    message,
    PromptTypes.ERROR,
  );

  const isAmbassadorDemotionExpired = useSelector(
    ambassadorDemotionExpiredSelector,
  );

  return useMemo(() => {
    if (!isAmbassadorDemotionExpired) {
      return {};
    }
    return prompt;
  }, [isAmbassadorDemotionExpired, prompt]);
}
