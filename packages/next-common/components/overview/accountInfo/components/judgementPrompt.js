import RequestJudgementPromptItem from "./requestJudgementPromptItem";
import NavigateToJudgementPagePromptItem from "./navigateToJudgementPagePromptItem";
import { useChain } from "next-common/context/chain";
import { isPeopleChain } from "next-common/utils/chain";

export function JudgementPrompt({ onClose }) {
  const chain = useChain();

  return (
    <>
      <NavigateToJudgementPagePromptItem onClose={onClose} />
      {isPeopleChain(chain) && <RequestJudgementPromptItem onClose={onClose} />}
    </>
  );
}
