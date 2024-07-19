import { PromptTypes } from "next-common/components/scrollPrompt";
import { fellowshipDemotionExpiredSelector } from "next-common/store/reducers/userPromptsSlice";
import { CACHE_KEY } from "next-common/utils/constants";
import Link from "next/link";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import usePrompt from "./usePrompt";

export default function useFellowshipDemotionExpiredPrompt() {
  const message = useMemo(
    () => (
      <div>
        The demotion period of fellowship member is expired. Manage your member
        status{" "}
        <Link className="underline" href={"/fellowship/core"}>
          here
        </Link>
      </div>
    ),
    [],
  );

  const prompt = usePrompt(
    CACHE_KEY.fellowshipDemotionExpiredVisible,
    message,
    PromptTypes.ERROR,
  );

  const isFellowshipDemotionExpired = useSelector(
    fellowshipDemotionExpiredSelector,
  );

  return useMemo(() => {
    if (!isFellowshipDemotionExpired) {
      return {};
    }
    return prompt;
  }, [isFellowshipDemotionExpired, prompt]);
}
