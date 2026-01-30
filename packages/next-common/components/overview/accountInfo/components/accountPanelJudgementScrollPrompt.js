import ScrollPromptContainer from "./ScrollPromptContainer";
import { JudgementPrompt } from "./judgementPrompt";

const promptComponents = [JudgementPrompt];

export default function AccountPanelJudgementScrollPrompt() {
  return <ScrollPromptContainer components={promptComponents} />;
}
