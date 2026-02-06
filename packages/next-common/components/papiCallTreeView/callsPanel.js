import CallPanel from "./callPanel";
import IndentPanel from "./indentPanel";

export default function CallsPanel({ node }) {
  const { name, type, children } = node || {};

  return (
    <div className="flex flex-col">
      <span className="font-medium truncate">{`${name}: ${type}`}</span>
      <IndentPanel className="gap-[8px]">
        {(children || [])
          .filter((call) => call !== null && call !== undefined)
          .map((call, i) => (
            <CallPanel key={i} callIndex={i} call={call} />
          ))}
      </IndentPanel>
    </div>
  );
}
