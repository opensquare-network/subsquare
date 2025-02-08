import React, { useState, useEffect } from "react";
import Input from "next-common/lib/input";
import { isNil } from "lodash-es";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import ProposeTree from "./proposeTree";
import { useContextApi } from "next-common/context/api";

export default function ProposeWithInputHex({ callHash, when }) {
  const [inputHex, setInputHex] = useState("");
  const [isMatchToCallHex, setIsMatchToCallHex] = useState(false);
  const api = useContextApi();

  useEffect(() => {
    if (!api || !callHash || isNil(inputHex)) {
      return;
    }

    const transferredCallHash = api?.registry?.hash(inputHex)?.toHex() || "";

    setIsMatchToCallHex(transferredCallHash === callHash);
  }, [api, callHash, inputHex]);

  return (
    <div className="flex flex-col space-y-2">
      <div className="text14Bold">Call Hex</div>
      <Input
        placeholder="0x prefixed hex, e.g. 0x1234 or ascii data"
        value={inputHex}
        onChange={(e) => setInputHex(e.target.value)}
      />
      {isMatchToCallHex && <ProposeTree callHex={inputHex} when={when} />}

      {!isMatchToCallHex && inputHex && (
        <GreyPanel className="justify-start gap-x-2 text14Medium py-2.5 px-4 max-w-full text-red500 bg-red100">
          Call hex does not match the existing call hash
        </GreyPanel>
      )}
    </div>
  );
}
