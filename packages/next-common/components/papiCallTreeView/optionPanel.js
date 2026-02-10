import IndentPanel from "./indentPanel";
import { ValuePanel } from "./valuePanel";

export default function OptionPanel({ node }) {
  const { name, type, children, value } = node || {};

  // If value is null/undefined, it's None
  if (value === null || value === undefined) {
    return (
      <div className="flex flex-col px-[16px] py-[8px] bg-neutral200 rounded-[4px]">
        <span className="text-textTertiary truncate">
          {name ? `${name}: ${type}` : type}
        </span>
        <div>None</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <span className="font-medium truncate">
        {name ? `${name}: ${type}` : type}
      </span>
      <IndentPanel className="gap-[8px]">
        {(children || [])
          .filter((child) => child !== null && child !== undefined)
          .map((child, i) => (
            <ValuePanel key={i} node={child} />
          ))}
      </IndentPanel>
    </div>
  );
}
