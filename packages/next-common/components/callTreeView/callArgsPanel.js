import { ValuePanel } from "./valuePanel";

export default function CallArgsPanel({ argsEntries, args }) {
  return (
    <div className="flex flex-col gap-[8px]">
      {(argsEntries || []).map(([argName, argValue], i) => (
        <ValuePanel
          key={argName}
          name={argName}
          value={argValue}
          type={args?.[i].type.toJSON()}
          typeName={args?.[i].typeName.toJSON()}
          registry={args?.[i].registry}
        />
      ))}
    </div>
  );
}
