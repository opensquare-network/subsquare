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

function PollForm({ isCreatePoll, setFormValue = () => {} }) {
  const initValue = {
    title: "",
    anonymous: true,
    votingLength: 15,
    options: ["", ""],
  };

  const VotingLengthOptions = [7, 15, 30].map((d) => {
    return {
      label: `${d} days`,
      value: d,
    };
  });

  const [value, setValue] = useState(initValue);
  const inputOptionsRef = useRef();

  useEffect(() => {
    setFormValue({
      poll: value,
    });
  }, [value]);

  useEffect(() => {
    if (isCreatePoll) {
      setValue(initValue);
    } else {
      setFormValue((v) => {
        delete v.poll;
        return v;
      });
    }
  }, [isCreatePoll]);

  const handleAddOption = () => {
    inputOptionsRef.current?.addOption?.();
  };

  if (!isCreatePoll) {
    return null;
  }

  return (
    <div>
      <FormItem label="Title">
        <Input
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
          <PollFormOptionAddOptionButton onClick={handleAddOption}>
            Add an option
          </PollFormOptionAddOptionButton>
        }
      >
        <InputOptions
          ref={inputOptionsRef}
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
          value={value.votingLength}
          options={VotingLengthOptions}
          onChange={(option) => {
            setValue({
              ...value,
              votingLength: option.value,
            });
          }}
        />
      </FormItem>

      <FormItem label="Setting">
        <PollFormAnonymousFormItem>
          <div>Anonymous (Voters' names will not be displayed)</div>
          <Toggle
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
