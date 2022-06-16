import { useEffect, useState } from "react";
import styled from "styled-components";
import Input from "../../../input";

const FormItem = styled.div`
  margin: 16px 0;
`;
const FormLabel = styled.div`
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 8px;
`;

function PollForm({ isCreatePoll, setFormValue = () => {} }) {
  const initValue = {
    title: "",
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
    </div>
  );
}

export default PollForm;
