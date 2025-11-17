import IndentPanel from "./indentPanel";
import { ValuePanel } from "./valuePanel";

export default function TuplePanel({ registry, name, type, values, sub }) {
  return (
    <div className="flex flex-col">
      <span className="font-medium truncate">
        {name ? `${name}: ${type}` : type}
      </span>
      <IndentPanel className="gap-[8px]">
        {(sub || []).map((item, index) => (
          <ValuePanel
            key={`tuple-${item.name}-${index}`}
            name={item.name}
            value={values[item.name]}
            type={item.type}
            typeName={item.type}
            registry={registry}
          />
        ))}
      </IndentPanel>
    </div>
  );
}
