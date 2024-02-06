import IndentPanel from "./indentPanel";
import { ValuePanel } from "./valuePanel";

export default function ArrayPanel({
  section,
  method,
  registry,
  name,
  type,
  values,
  sub,
}) {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <span className="font-medium truncate">
          {name ? `${name}: ${type}` : type}
        </span>
      </div>
      <IndentPanel className="gap-[8px]">
        {values.map((value, i) => (
          <ValuePanel
            key={`value-${i}`}
            section={section}
            method={method}
            name={`${i}`}
            type={(sub[i] || sub[0])?.type}
            typeName={(sub[i] || sub[0])?.type}
            value={value}
            registry={registry}
          />
        ))}
      </IndentPanel>
    </div>
  );
}
