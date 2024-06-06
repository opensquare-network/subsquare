import { SystemClose } from "@osn/icons/subsquare";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import useDelegationPrompt from "./useDelegationPrompt";

export default function AccountDelegationPrompt() {
  const { message: prompt, close } = useDelegationPrompt();
  if (!prompt) {
    return null;
  }

  return (
    <GreyPanel className="!bg-theme100 text-theme500 text14Medium py-2.5 px-4 justify-between">
      {prompt}
      <SystemClose className="w-5 h-5" role="button" onClick={close} />
    </GreyPanel>
  );
}
