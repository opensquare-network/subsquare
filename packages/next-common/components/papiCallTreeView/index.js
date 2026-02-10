import IndentPanel from "./indentPanel";
import CallArgsPanel from "./callArgsPanel";
import { CallContextProvider } from "./callContext";

export default function PapiCallTreeView({ proposal }) {
  const { section, method, children } = proposal || {};

  return (
    <div className="text-textPrimary">
      <div className="flex flex-col text14Medium">
        <span className="font-medium leading-[20px]">{`${section}.${method}`}</span>
      </div>
      <IndentPanel>
        <CallContextProvider value={{ section, method }}>
          <CallArgsPanel>{children}</CallArgsPanel>
        </CallContextProvider>
      </IndentPanel>
    </div>
  );
}
