import { useState, useMemo } from "react";
import Input from "next-common/lib/input";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import ProposeTree from "./proposeTree";
import { useContextApi } from "next-common/context/api";
import { useMultisigSignContext } from "./context";

export default function ProposeWithInputHex() {
  const {
    multisig: { callHash, when },
    setValue,
  } = useMultisigSignContext();

  const [inputHex, setInputHex] = useState("");
  const api = useContextApi();

  const inputCallHash = useMemo(() => {
    if (!api || !inputHex) {
      return "";
    }

    return api?.registry?.hash(inputHex)?.toHex() || "";
  }, [inputHex, api]);

  return (
    <div className="flex flex-col space-y-2">
      <div className="text14Bold">Call Hex</div>
      <Input
        placeholder="0x prefixed hex, e.g. 0x1234 or ascii data"
        value={inputHex}
        onChange={(e) => setInputHex(e.target.value)}
      />
      {inputCallHash === callHash && (
        <ProposeTree callHex={inputHex} when={when} setValue={setValue} />
      )}

      {inputCallHash !== callHash && inputHex && (
        <GreyPanel className="justify-start gap-x-2 text14Medium py-2.5 px-4 max-w-full text-red500 bg-red100">
          Call hex does not match the existing call hash
        </GreyPanel>
      )}
    </div>
  );
}
