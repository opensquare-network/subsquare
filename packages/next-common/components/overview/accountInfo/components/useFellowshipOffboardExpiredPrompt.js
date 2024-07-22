import { PromptTypes } from "next-common/components/scrollPrompt";
import { fellowshipOffboardExpiredSelector } from "next-common/store/reducers/userPromptsSlice";
import { CACHE_KEY } from "next-common/utils/constants";
import Link from "next/link";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import usePrompt from "./usePrompt";

export default function useFellowshipOffboardExpiredPrompt() {
  const message = useMemo(
    () => (
      <div>
        The offboard period of fellowship member is expired. Manage your member
        status{" "}
        <Link className="underline" href={"/fellowship/core"}>
          here
        </Link>
      </div>
    ),
    [],
  );

  const prompt = usePrompt(
    CACHE_KEY.fellowshipOffboardExpiredVisible,
    message,
    PromptTypes.ERROR,
  );

  const isFellowshipOffboardExpired = useSelector(
    fellowshipOffboardExpiredSelector,
  );

  return useMemo(() => {
    if (!isFellowshipOffboardExpired) {
      return {};
    }
    return prompt;
  }, [isFellowshipOffboardExpired, prompt]);
}
