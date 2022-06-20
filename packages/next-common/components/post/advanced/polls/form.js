import { useEffect, useRef, useState } from "react";
import Input from "../../../input";
import {
  PollFormAnonymousFormItem,
  PollFormOptionAddOptionButton,
} from "../elements";
import Toggle from "../../../toggle";
import Select from "../../../select";
import InputOptions from "./inputOptions";
import FormItem from "../formItem";
import dayjs from "dayjs";

function PollForm({ disabled, isCreatePoll, setFormValue = () => {} }) {
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
        expiresTime: dayjs().add(value.expiresTime, "day").valueOf(),
      },
    });
  }, [value]);

  useEffect(() => {
    if (isCreatePoll) {
      setValue(initValue);
    } else {
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
        <Select
          disabled={disabled}
          value={value.expiresTime}
          options={expiresTimeOptions}
          onChange={(option) => {
            setValue({
              ...value,
              expiresTime: option.value,
            });
          }}
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

export default PollForm;
