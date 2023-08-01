import CallPanel from "./callPanel";
import IndentPanel from "./indentPanel";

export default function CallsPanel({ name, type, calls }) {
  return (
    <div className="flex flex-col">
      <span className="font-medium truncate">{`${name}: ${type}`}</span>
      <IndentPanel className="gap-[8px]">
        {calls.map((call, i) => (
          <CallPanel key={`call-${i}`} callIndex={i} call={call} />
        ))}
      </IndentPanel>
    </div>
  );
}
