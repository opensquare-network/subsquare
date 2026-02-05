import { isNil } from "lodash-es";
import FoldButton from "./foldButton";
import { useState } from "react";
import IndentPanel from "./indentPanel";
import CallArgsPanel from "./callArgsPanel";
import { CallContextProvider } from "./callContext";

export default function CallPanel({ call, callIndex }) {
  const [folded, setFolded] = useState(true);
  const { section, method, children } = call || {};

  return (
    <div>
      <div className="flex px-[16px] py-[8px] bg-neutral200 rounded-[4px] justify-between">
        <div className="flex flex-col">
          <span className="font-medium leading-[20px] text-textTertiary">
            {isNil(callIndex) ? "call: Call" : `${callIndex}: Call: Call`}
          </span>
          <span className="font-medium leading-[20px] truncate">{`${section}.${method}`}</span>
        </div>
        <div className="flex flex-col justify-end">
          <FoldButton setFolded={setFolded} folded={folded} />
        </div>
      </div>
      {!folded && (
        <IndentPanel>
          <CallContextProvider value={{ section, method }}>
            <CallArgsPanel>{children}</CallArgsPanel>
          </CallContextProvider>
        </IndentPanel>
      )}
    </div>
  );
}
