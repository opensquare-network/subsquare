import IndentPanel from "./indentPanel";
import { ValuePanel } from "./valuePanel";

export default function EnumPanel({ node }) {
  const { name, type, children } = node || {};

  // If no children, it's a simple enum variant without data
  if (!children || children.length === 0) {
    return (
      <div className="flex flex-col px-[16px] py-[8px] bg-neutral200 rounded-[4px]">
        <span className="text-textTertiary truncate">
          {name ? `${name}: ${type}` : type}
        </span>
        <div>{name || type}</div>
      </div>
    );
  }

  // Enum with data - render the variant name and its children
  const variantChild = children[0];
  const variantName = variantChild?.name;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col px-[16px] py-[8px] bg-neutral200 rounded-[4px]">
        <span className="text-textTertiary truncate">
          {name ? `${name}: ${type}` : type}
        </span>
        <div>{variantName}</div>
      </div>
      <IndentPanel className="gap-[8px]">
        <ValuePanel node={variantChild} />
      </IndentPanel>
    </div>
  );
}
