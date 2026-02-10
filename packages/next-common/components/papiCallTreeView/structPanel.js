import IndentPanel from "./indentPanel";
import { ValuePanel } from "./valuePanel";

export default function StructPanel({ node }) {
  const { name, type, children } = node || {};

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
