import { PromptTypes } from "next-common/components/scrollPrompt";
import { fellowshipDemotionExpireRemindSelector } from "next-common/store/reducers/userPromptsSlice";
import { CACHE_KEY } from "next-common/utils/constants";
import Link from "next/link";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import usePrompt from "./usePrompt";

export default function useFellowshipDemotionExpireRemindPrompt() {
  const message = useMemo(
    () => (
      <div>
        The demotion period of fellowship member is about to expire. Manage your
        member status{" "}
        <Link className="underline" href={"/fellowship/core"}>
          here
        </Link>
      </div>
    ),
    [],
  );

  const prompt = usePrompt(
    CACHE_KEY.fellowshipDemotionExpireRemindVisible,
    message,
    PromptTypes.WARNING,
  );

  const isFellowshipDemotionExpireRemind = useSelector(
    fellowshipDemotionExpireRemindSelector,
  );

  return useMemo(() => {
    if (!isFellowshipDemotionExpireRemind) {
      return {};
    }
    return prompt;
  }, [isFellowshipDemotionExpireRemind, prompt]);
}
