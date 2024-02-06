import { ValuePanel } from "./valuePanel";

export default function CallArgsPanel({ section, method, argsEntries, args }) {
  return (
    <div className="flex flex-col gap-[8px]">
      {(argsEntries || []).map(([argName, argValue], i) => (
        <ValuePanel
          key={argName}
          section={section}
          method={method}
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
