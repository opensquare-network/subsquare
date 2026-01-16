import SetIdentityPromptItem from "./setIdentityPromptItem";
import RequestJudgementPromptItem from "./requestJudgementPromptItem";
import NavigateToJudgementPagePromptItem from "./navigateToJudgementPagePromptItem";
import { useChain } from "next-common/context/chain";
import { isPeopleChain } from "next-common/utils/chain";

export {
  SetIdentityPromptItem,
  RequestJudgementPromptItem,
  NavigateToJudgementPagePromptItem,
};

export function IdentityPrompt({ onClose }) {
  const chain = useChain();

  return (
    <>
      <SetIdentityPromptItem onClose={onClose} />
      <NavigateToJudgementPagePromptItem onClose={onClose} />
      {isPeopleChain(chain) && <RequestJudgementPromptItem onClose={onClose} />}
    </>
  );
}
