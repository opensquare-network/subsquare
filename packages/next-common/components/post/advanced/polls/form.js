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
import dayjs from "dayjs";
import DatePicker from "../../../datePicker";

function PollForm({ disabled, isCreatePoll, setFormValue = () => {} }, ref) {
  const initValue = {
    title: "",
    options: ["", ""],
    expiresTime: 15,
    anonymous: true,
  };

  const expiresTimeOptions = [7, 15, 30].map((d) => {
    return {
      label: `${d} days`,
      value: d,
    };
  });

  const [value, setValue] = useState(initValue);
  const inputOptionsRef = useRef();

  useEffect(() => {
    setFormValue({
      polls: {
        ...value,
        options: value.options.map((option) => option?.trim()),
        expiresTime: dayjs().add(value.expiresTime, "day").valueOf(),
      },
    });
  }, [value]);

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

    let result = false;
    result = !!value.title && value.options.every((i) => i);

    return result;
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
        <DatePicker setDate={() => {}} />
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
