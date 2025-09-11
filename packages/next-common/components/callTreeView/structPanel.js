import IndentPanel from "./indentPanel";
import { ValuePanel } from "./valuePanel";

export default function StructPanel({
  registry,
  name,
  type,
  typeName,
  value,
  sub,
}) {
  let subName, subType;

  if (value.type) {
    ({ name: subName, type: subType } = sub.find(
      (item) => item.name === value.type.toString(),
    ));
  } else {
    return (
      <ValuePanel name={name} type={type} typeName={typeName} value={value} />
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col px-[16px] py-[8px] bg-neutral200 rounded-[4px]">
        <span className="text-textTertiary truncate">
          {name ? `${name}: ${type}` : type}
        </span>
        <div>{subName}</div>
      </div>
      {!value.isNone && (
        <IndentPanel className="gap-[8px]">
          <ValuePanel
            registry={registry}
            name={subName}
            typeName={subType}
            type={subType}
            value={value.value}
          />
        </IndentPanel>
      )}
    </div>
  );
}
