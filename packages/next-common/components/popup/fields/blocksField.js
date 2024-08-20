import Input from "next-common/components/input";
import PopupLabel from "../label";
import Toggle from "next-common/components/toggle";
import { useState } from "react";

function BlocksFieldToggleSwitch({ isEditable, setIsEditable }) {
  return (
    <div className="flex items-center gap-[8px]">
      <span className="text-textSecondary text12Medium whitespace-nowrap">
        Edit Mode
      </span>
      <Toggle
        size="small"
        isOn={isEditable}
        onToggle={() => setIsEditable(!isEditable)}
      />
    </div>
  );
}

export default function BlocksField({ title = "Blocks", value, setValue }) {
  const [isEditable, setIsEditable] = useState(false);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue.trim() ? inputValue : 'None');
  };

  const placeholder = isEditable ? "Please fill a block height..." : "";

  return (
    <div>
      <div className="flex justify-between items-center mb-[8px]">
        <PopupLabel text={title} />
        <BlocksFieldToggleSwitch
          isEditable={isEditable}
          setIsEditable={setIsEditable}
        />
      </div>
      <Input
        value={isEditable ? value : "None"}
        placeholder={placeholder}
        symbol="Block Height"
        onChange={handleInputChange}
        disabled={!isEditable}
      />
    </div>
  );
}