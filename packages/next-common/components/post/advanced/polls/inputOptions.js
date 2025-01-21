import Input from "next-common/lib/input";
import { Trash } from "../../../icons";
import React, { forwardRef, useImperativeHandle } from "react";

function InputOptions({ disabled, value, onChange = () => {} }, ref) {
  const options = value;
  const setOptions = onChange;

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleDeleteOption = (idx) => {
    const newOptions = [...options];
    newOptions.splice(idx, 1);
    setOptions(newOptions);
  };

  const isExtraOption = (idx) => idx >= 2;

  useImperativeHandle(ref, () => ({
    addOption: handleAddOption,
  }));

  return (
    <div className="space-y-2">
      {options.map((v, idx) => (
        <Input
          disabled={disabled}
          value={v}
          onChange={(event) => {
            const newOptions = [...options];
            newOptions[idx] = event.target.value?.trimStart();
            setOptions(newOptions);
          }}
          key={idx}
          placeholder={`Option${
            isExtraOption(idx) ? "" : ` ${idx + 1} (required)`
          }`}
          suffix={
            isExtraOption(idx) && (
              <Trash onClick={() => handleDeleteOption(idx)} />
            )
          }
        />
      ))}
    </div>
  );
}

export default forwardRef(InputOptions);
