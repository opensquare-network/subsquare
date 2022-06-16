import { useEffect, useState } from "react";
import Input from "../../../input";
import { FormItem, FormLabel, PollFormAnonymousFormItem } from "../elements";
import Toggle from "../../../toggle";

function PollForm({ isCreatePoll, setFormValue = () => {} }) {
  const initValue = {
    title: "",
    anonymous: true,
  };

  const [value, setValue] = useState(initValue);

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

  if (!isCreatePoll) {
    return null;
  }

  return (
    <div>
      <FormItem>
        <FormLabel>Title</FormLabel>
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

      <FormItem>
        <FormLabel>Setting</FormLabel>
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
