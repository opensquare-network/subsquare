import { PromptTypes } from "next-common/components/scrollPrompt";
import { ambassadorOffboardExpireRemindSelector } from "next-common/store/reducers/userPromptsSlice";
import { CACHE_KEY } from "next-common/utils/constants";
import Link from "next/link";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import usePrompt from "./usePrompt";

export default function useAmbassadorOffboardExpireRemindPrompt() {
  const message = useMemo(
    () => (
      <div>
        The offboard period of ambassador member is about to expire. Manage your
        member status{" "}
        <Link className="underline" href={"/ambassador/core"}>
          here
        </Link>
      </div>
    ),
    [],
  );

  const prompt = usePrompt(
    CACHE_KEY.ambassadorOffboardExpireRemindVisible,
    message,
    PromptTypes.WARNING,
  );

  const isAmbassadorOffboardExpireRemind = useSelector(
    ambassadorOffboardExpireRemindSelector,
  );

  return useMemo(() => {
    if (!isAmbassadorOffboardExpireRemind) {
      return {};
    }
    return prompt;
  }, [isAmbassadorOffboardExpireRemind, prompt]);
}
