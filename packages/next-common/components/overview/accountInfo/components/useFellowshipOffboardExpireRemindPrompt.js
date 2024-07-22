import { PromptTypes } from "next-common/components/scrollPrompt";
import { fellowshipOffboardExpireRemindSelector } from "next-common/store/reducers/userPromptsSlice";
import { CACHE_KEY } from "next-common/utils/constants";
import Link from "next/link";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import usePrompt from "./usePrompt";

export default function useFellowshipOffboardExpireRemindPrompt() {
  const message = useMemo(
    () => (
      <div>
        The offboard period of fellowship member is about to expire. Manage your
        member status{" "}
        <Link className="underline" href={"/fellowship/core"}>
          here
        </Link>
      </div>
    ),
    [],
  );

  const prompt = usePrompt(
    CACHE_KEY.fellowshipOffboardExpireRemindVisible,
    message,
    PromptTypes.WARNING,
  );

  const isFellowshipOffboardExpireRemind = useSelector(
    fellowshipOffboardExpireRemindSelector,
  );

  return useMemo(() => {
    if (!isFellowshipOffboardExpireRemind) {
      return {};
    }
    return prompt;
  }, [isFellowshipOffboardExpireRemind, prompt]);
}
