import { PromptTypes } from "next-common/components/scrollPrompt";
import { fellowshipPromotableSelector } from "next-common/store/reducers/userPromptsSlice";
import { CACHE_KEY } from "next-common/utils/constants";
import Link from "next/link";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import usePrompt from "./usePrompt";

export default function useFellowshipPromotablePrompt() {
  const message = useMemo(
    () => (
      <div>
        Your fellowship member ranking is available to be promoted. Manage your
        member status{" "}
        <Link className="underline" href={"/fellowship/core"}>
          here
        </Link>
      </div>
    ),
    [],
  );

  const prompt = usePrompt(
    CACHE_KEY.fellowshipPromotableVisible,
    message,
    PromptTypes.SUCCESS,
  );

  const isFellowshipPromotable = useSelector(fellowshipPromotableSelector);

  return useMemo(() => {
    if (!isFellowshipPromotable) {
      return {};
    }
    return prompt;
  }, [isFellowshipPromotable, prompt]);
}
