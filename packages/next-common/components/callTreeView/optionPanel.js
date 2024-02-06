import IndentPanel from "./indentPanel";
import { ValuePanel } from "./valuePanel";

export default function OptionPanel({
  section,
  method,
  registry,
  name,
  type,
  value,
  sub,
}) {
  const { name: subName, type: subType } = sub;
  return (
    <div className="flex flex-col">
      <span className="font-medium truncate">
        {name ? `${name}: ${type}` : type}
      </span>
      <IndentPanel className="gap-[8px]">
        <ValuePanel
          section={section}
          method={method}
          name={subName}
          value={value.value}
          type={subType}
          typeName={subType}
          registry={registry}
        />
      </IndentPanel>
    </div>
  );
}
