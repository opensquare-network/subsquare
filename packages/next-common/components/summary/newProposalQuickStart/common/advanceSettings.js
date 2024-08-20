import { useState } from "react";

export default function AdvanceSettings({ children }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text12Bold text-textPrimary">Advanced</span>
        <span
          className="cursor-pointer text12Medium text-theme500"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? "Cancel" : "Settings"}
        </span>
      </div>
      {showAdvanced ? <div className="space-y-4">{children}</div> : null}
    </>
  );
}
