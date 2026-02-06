import { ValuePanel } from "./valuePanel";

export default function CallArgsPanel({ children }) {
  return (
    <div className="flex flex-col gap-[8px]">
      {(children || [])
        .filter((child) => child !== null && child !== undefined)
        .map((child, i) => (
          <ValuePanel key={i} node={child} />
        ))}
    </div>
  );
}
