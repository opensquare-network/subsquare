// import { SystemClose } from "@osn/icons/subsquare";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { useChainSettings } from "next-common/context/chain";
import { colorStyle, PromptTypes } from "next-common/components/scrollPrompt";

export default function CoretimeStats() {
  const { modules } = useChainSettings();

  if (!modules?.coretime) {
    return null;
  }

  return (
    <GreyPanel
      className="text14Medium py-2.5 px-4 justify-between"
      style={colorStyle[PromptTypes.NEUTRAL]}
    >
      Coretime:
      {/* <SystemClose className="w-5 h-5" role="button" onClick={close} /> */}
    </GreyPanel>
  );
}
