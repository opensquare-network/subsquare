import React, { useState, useEffect } from "react";
import Input from "next-common/lib/input";
import { isNil } from "lodash-es";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import ProposeTree from "./proposeTree";

// TODO: decode callHex to call data.(useCallFromHex)
// check if inputHex is not match callHex
export default function ProposeWithInputHex({ callHex, when }) {
  const [inputHex, setInputHex] = useState("");
  const [isNotMatchCallHex, setIsNotMatchCallHex] = useState(false);

  useEffect(() => {
    if (isNil(inputHex)) {
      setIsNotMatchCallHex(false);
      return;
    }

    setIsNotMatchCallHex(inputHex !== callHex);
  }, [inputHex, callHex]);

  return (
    <div className="flex flex-col space-y-2">
      <div className="text14Bold">Call Hex</div>
      <Input
        placeholder="0x prefixed hex, e.g. 0x1234 or ascii data"
        value={inputHex}
        onChange={(e) => setInputHex(e.target.value)}
      />
      {isNotMatchCallHex ? (
        <GreyPanel className="justify-start gap-x-2 text14Medium py-2.5 px-4 max-w-full text-red500 bg-red100">
          Call hex does not match the existing call hash
        </GreyPanel>
      ) : (
        <ProposeTree callHex={inputHex} when={when} />
      )}
    </div>
  );
}
