import React, { useState } from "react";
import IndentPanel from "next-common/components/callTreeView/indentPanel";
import Toggle from "next-common/components/toggle";
import Param from "./param";

function IncludeOption({ isOn, setIsOn }) {
  return (
    <div className="flex gap-[8px] items-center">
      <span className="whitespace-nowrap text-[12px] font-medium text-textSecondary">
        include option
      </span>
      <Toggle isOn={isOn} onToggle={setIsOn} size="small" />
    </div>
  );
}

export default function OptionParam({ def, value, setValue }) {
  const [isOn, setIsOn] = useState(true);
  const subType = def?.sub;

  return (
    <div className="flex flex-col">
      <IndentPanel className="flex flex-col gap-[8px]">
        <div className="flex justify-end gap-[8px]">
          <IncludeOption isOn={isOn} setIsOn={setIsOn} />
        </div>
        {isOn && (
          <Param
            name={subType?.name}
            def={subType}
            value={value}
            setValue={setValue}
          />
        )}
      </IndentPanel>
    </div>
  );
}
