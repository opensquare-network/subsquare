import { colorStyle, PromptTypes } from "../scrollPrompt";
import { GreyPanel } from "../styled/containers/greyPanel";

export function MultisigErrorMessage({ children }) {
  return (
    <GreyPanel
      style={colorStyle[PromptTypes.ERROR]}
      className="text14Medium px-4 py-2.5"
    >
      {children}
    </GreyPanel>
  );
}

export function MultisigNeutralMessage({ children }) {
  return (
    <GreyPanel
      style={colorStyle[PromptTypes.NEUTRAL]}
      className="text14Medium px-4 py-2.5"
    >
      {children}
    </GreyPanel>
  );
}

export const ERROR_MESSAGE = {
  MULTISIG_EXIST: "This multisig address is already saved.",
  NAME_EXIST: "This multisig name is already saved.",
  THRESHOLD_ERROR: "The threshold must be less than the number of signatories.",
  UNIQUE_ERROR: "The signatories must be unique.",
};
