import Link from "next-common/components/link";
import {
  PromptTypes,
  ScrollPromptItemWrapper,
} from "next-common/components/scrollPrompt";
import { CACHE_KEY } from "next-common/utils/constants";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import { useMemo } from "react";
import useMyJudgementRequest from "next-common/components/people/hooks/useMyJudgementRequest";

function NavigateToJudgementPagePrompt() {
  return (
    <div>
      Actions is required to verify your identity social accounts.&nbsp;
      <Link className="underline text14Medium" href="/people/verifications">
        Go to Judgement page
      </Link>
      .
    </div>
  );
}

function useNavigateToJudgementPagePromptItem() {
  const { value: myJudgementRequest } = useMyJudgementRequest();

  const needAction =
    myJudgementRequest &&
    Object.values(myJudgementRequest.verifications).some(
      (verified) => verified !== true,
    );

  const [visible, setVisible] = useCookieValue(
    CACHE_KEY.navigateToJudgementPagePrompt,
    true,
  );

  return useMemo(() => {
    if (!visible || !needAction) {
      return {};
    }

    return {
      key: CACHE_KEY.navigateToJudgementPagePrompt,
      message: <NavigateToJudgementPagePrompt />,
      type: PromptTypes.INFO,
      close: () => setVisible(false, { expires: 15 }),
    };
  }, [needAction, setVisible, visible]);
}

export default function NavigateToJudgementPagePromptItem({ onClose }) {
  const prompt = useNavigateToJudgementPagePromptItem();

  if (!prompt?.message) {
    return null;
  }

  return (
    <ScrollPromptItemWrapper
      prompt={{
        ...prompt,
        close: () => {
          onClose?.();
          prompt?.close?.();
        },
      }}
    />
  );
}
