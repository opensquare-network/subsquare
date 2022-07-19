import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Input from "../../../input";
import {
  PollFormAnonymousFormItem,
  PollFormOptionAddOptionButton,
} from "../elements";
import Toggle from "../../../toggle";
import InputOptions from "./inputOptions";
import FormItem from "../formItem";
import DatePicker from "../../../datePicker";

function PollForm({ disabled, isCreatePoll, setFormValue = () => {} }, ref) {
  const [endTime, setEndTime] = useState(null);
  const onSelectDatetime = (timestamp) => setEndTime(timestamp);

  const initValue = {
    title: "",
    options: ["", ""],
    anonymous: true,
  };

  const [value, setValue] = useState(initValue);
  const inputOptionsRef = useRef();

  useEffect(() => {
    setFormValue({
      polls: {
        ...value,
        options: value.options.map((option) => option?.trim()),
        expiresTime: endTime,
      },
    });
  }, [value, endTime]);

  useEffect(() => {
    setValue(initValue);
    if (!isCreatePoll) {
      setFormValue((v) => {
        delete v.polls;
        return v;
      });
    }
  }, [isCreatePoll]);

  const handleAddOption = () => {
    if (disabled) {
      return;
    }
    inputOptionsRef.current?.addOption?.();
  };

  const validateForm = () => {
    if (!isCreatePoll) {
      return true;
    }

    return !!value.title && value.options.every((i) => i);
  };

  useImperativeHandle(ref, () => ({
    validateForm,
  }));

  if (!isCreatePoll) {
    return null;
  }

  return (
    <div>
      <FormItem label="Title">
        <Input
          disabled={disabled}
          value={value.title}
          onChange={(event) => {
            setValue({
              ...value,
              title: event.target.value,
            });
          }}
          placeholder="Please fill the title..."
        />
      </FormItem>

      <FormItem
        label="Option"
        labelExternal={
          <PollFormOptionAddOptionButton
            disabled={disabled}
            onClick={handleAddOption}
          >
            Add an option
          </PollFormOptionAddOptionButton>
        }
      >
        <InputOptions
          ref={inputOptionsRef}
          disabled={disabled}
          value={value.options}
          onChange={(options) => {
            setValue({
              ...value,
              options,
            });
          }}
        />
      </FormItem>

      <FormItem label="Voting length">
        <DatePicker
          onSelectDatetime={onSelectDatetime}
          placeholder="Please select the time..."
        />
      </FormItem>

      <FormItem label="Setting">
        <PollFormAnonymousFormItem>
          <div>Anonymous (Voters' names will not be displayed)</div>
          <Toggle
            disabled={disabled}
            isOn={value.anonymous}
            onToggle={(v) => {
              setValue({
                ...value,
                anonymous: v,
              });
            }}
          />
        </PollFormAnonymousFormItem>
      </FormItem>
    </div>
  );
}

export default forwardRef(PollForm);
