import { PromptTypes } from "next-common/components/scrollPrompt";
import { ambassadorPromotableSelector } from "next-common/store/reducers/userPromptsSlice";
import { CACHE_KEY } from "next-common/utils/constants";
import Link from "next/link";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import usePrompt from "./usePrompt";

export default function useAmbassadorPromotablePrompt() {
  const message = useMemo(
    () => (
      <div>
        Your ambassador member ranking is available to be promoted. Manage your
        member status{" "}
        <Link className="underline" href={"/ambassador/core"}>
          here
        </Link>
      </div>
    ),
    [],
  );

  const prompt = usePrompt(
    CACHE_KEY.ambassadorPromotableVisible,
    message,
    PromptTypes.SUCCESS,
  );

  const isAmbassadorPromotable = useSelector(ambassadorPromotableSelector);

  return useMemo(() => {
    if (!isAmbassadorPromotable) {
      return {};
    }
    return prompt;
  }, [isAmbassadorPromotable, prompt]);
}
