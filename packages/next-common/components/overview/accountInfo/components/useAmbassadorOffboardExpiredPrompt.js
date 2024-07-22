import { PromptTypes } from "next-common/components/scrollPrompt";
import { ambassadorOffboardExpiredSelector } from "next-common/store/reducers/userPromptsSlice";
import { CACHE_KEY } from "next-common/utils/constants";
import Link from "next/link";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import usePrompt from "./usePrompt";

export default function useAmbassadorOffboardExpiredPrompt() {
  const message = useMemo(
    () => (
      <div>
        The offboard period of ambassador member is expired. Manage your member
        status{" "}
        <Link className="underline" href={"/ambassador/core"}>
          here
        </Link>
      </div>
    ),
    [],
  );

  const prompt = usePrompt(
    CACHE_KEY.ambassadorOffboardExpiredVisible,
    message,
    PromptTypes.ERROR,
  );

  const isAmbassadorOffboardExpired = useSelector(
    ambassadorOffboardExpiredSelector,
  );

  return useMemo(() => {
    if (!isAmbassadorOffboardExpired) {
      return {};
    }
    return prompt;
  }, [isAmbassadorOffboardExpired, prompt]);
}
