import { SystemClose } from "@osn/icons/subsquare";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import useDelegationPrompt from "./useDelegationPrompt";
import { useEffect, useState } from "react";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import { CACHE_KEY } from "next-common/utils/constants";

export default function AccountDelegationPrompt() {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useCookieValue(
    CACHE_KEY.delegationPromptVisible,
    true,
  );

  useEffect(() => {
    setVisible(value);
  }, [value]);

  const prompt = useDelegationPrompt();
  if (!visible || !prompt) {
    return null;
  }

  function close() {
    setValue(false, { expires: 15 });
  }

  return (
    <GreyPanel className="!bg-theme100 text-theme500 text14Medium py-2.5 px-4 justify-between">
      {prompt}
      <SystemClose className="w-5 h-5" role="button" onClick={close} />
    </GreyPanel>
  );
}
