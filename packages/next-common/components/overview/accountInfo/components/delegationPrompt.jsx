import { SystemClose } from "@osn/icons/subsquare";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import { useChain, useChainSettings } from "next-common/context/chain";
import { isKintsugiChain } from "next-common/utils/chain";
import { CACHE_KEY } from "next-common/utils/constants";
import { useCookieValue } from "next-common/utils/hooks/useCookieValue";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AccountDelegationPrompt() {
  const chain = useChain();
  const chainSettings = useChainSettings();

  const [visible, setVisible] = useState(false);
  const [value, setValue] = useCookieValue(
    CACHE_KEY.delegationPromptVisible,
    true,
  );

  useEffect(() => {
    setVisible(value);
  }, [value]);

  function close() {
    setValue(false, { expires: 15 });
  }

  const hasDelegation =
    (chainSettings.hasReferenda || !chainSettings.noDemocracy) &&
    !isKintsugiChain(chain);

  if (!hasDelegation || !visible) {
    return null;
  }

  return (
    <GreyPanel className="!bg-theme100 text-theme500 text14Medium py-2.5 px-4 justify-between">
      <div>
        No time to vote? Delegate your votes to an expert{" "}
        <Link className="underline" href={"/delegation"}>
          here
        </Link>
      </div>

      <SystemClose className="w-5 h-5" role="button" onClick={close} />
    </GreyPanel>
  );
}
