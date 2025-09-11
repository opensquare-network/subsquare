import IndentPanel from "./indentPanel";
import CallArgsPanel from "./callArgsPanel";
import { CallContextProvider } from "./callContext";

export default function CallTreeView({ proposal }) {
  const { section, method, meta, argsEntries } = proposal || {};
  const { docs, args } = meta || {};
  const doc = docs?.[0]?.toJSON();

  return (
    <div className="text-textPrimary">
      <div className="flex flex-col text14Medium">
        <span className="font-medium leading-[20px]">{`${section}.${method}`}</span>
        <span className="text-textTertiary text-[12px] leading-[16px]">
          {doc}
        </span>
      </div>
      <IndentPanel>
        <CallContextProvider value={{ section, method }}>
          <CallArgsPanel argsEntries={argsEntries} args={args} />
        </CallContextProvider>
      </IndentPanel>
    </div>
  );
}
