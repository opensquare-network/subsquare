import { useState, useMemo, useCallback, useEffect } from "react";
import Input from "next-common/lib/input";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import ProposeTree from "./proposeTree";
import { useContextApi } from "next-common/context/api";
import { useMultisigSignContext } from "./context";

export function InvalidCallPrompt({ content }) {
  return (
    <GreyPanel className="justify-start gap-x-2 text14Medium py-2.5 px-4 max-w-full text-red500 bg-red100">
      {content}
    </GreyPanel>
  );
}

export default function ProposeWithInputHex() {
  const api = useContextApi();
  const [inputHex, setInputHex] = useState("");

  const {
    setCallData,
    multisig: { callHash, when },
  } = useMultisigSignContext();

  const inputCallHash = useMemo(() => {
    if (!api || !inputHex) {
      return "";
    }

    return api?.registry?.hash(inputHex)?.toHex() || "";
  }, [inputHex, api]);

  const isMatchCallHash = useMemo(
    () => inputCallHash === callHash,
    [inputCallHash, callHash],
  );

  const setValue = useCallback(
    ({ isValid, data }) => {
      if (!api || !setCallData) {
        return;
      }

      setCallData("input", { callData: data, isValid });
    },
    [api, setCallData],
  );

  useEffect(() => {
    if (isMatchCallHash) {
      return;
    }

    setValue({ isValid: false, data: null });
  }, [inputCallHash, callHash, setValue, isMatchCallHash]);

  return (
    <div className="flex flex-col space-y-2">
      <div className="text14Bold">Call Hex</div>
      <Input
        placeholder="0x prefixed hex, e.g. 0x1234 or ascii data"
        value={inputHex}
        onChange={(e) => setInputHex(e.target.value)}
      />
      {isMatchCallHash && (
        <ProposeTree callHex={inputHex} when={when} setValue={setValue} />
      )}

      {!isMatchCallHash && inputHex && (
        <InvalidCallPrompt content="Invalid call hex" />
      )}
    </div>
  );
}
