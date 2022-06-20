import Input from "../../../input";
import { Trash } from "../../../icons";
import { PollFormOptionFormItem } from "../elements";
import React, {
  forwardRef,
  useEffect,
  useState,
  useImperativeHandle,
} from "react";

function InputOptions({ value, onChange = () => {} }, ref) {
  const [options, setOptions] = useState(value);

  const handleAddOption = () => {
    setOptions((v) => [...v, ""]);
  };

  const handleDeleteOption = (idx) => {
    setOptions((v) => {
      v.splice(idx, 1);
      return [...v];
    });
  };

  const isExtraOption = (idx) => idx >= 2;

  useImperativeHandle(ref, () => ({
    addOption: handleAddOption,
  }));

  useEffect(() => onChange(options), [options]);

  return (
    <PollFormOptionFormItem>
      {options.map((v, idx) => (
        <Input
          value={v}
          onChange={(event) => {
            setOptions((v) => {
              v[idx] = event.target.value;
              return [...v];
            });
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
    </PollFormOptionFormItem>
  );
}

export default forwardRef(InputOptions);
