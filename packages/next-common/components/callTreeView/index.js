import IndentPanel from "./indentPanel";
import CallArgsPanel from "./callArgsPanel";

export default function CallTreeView({ proposal }) {
  const { section, method, meta, argsEntries } = proposal || {};
  const { docs, args } = meta || {};
  const doc = docs?.[0]?.toJSON();

  return (
    <div className="text-textPrimary">
      <div className="flex flex-col">
        <span className="font-medium leading-[20px]">{`${section}.${method}`}</span>
        <span className="text-textTertiary text-[12px] leading-[16px]">
          {doc}
        </span>
      </div>
      <IndentPanel>
        <CallArgsPanel
          section={section}
          method={method}
          argsEntries={argsEntries}
          args={args}
        />
      </IndentPanel>
    </div>
  );
}
