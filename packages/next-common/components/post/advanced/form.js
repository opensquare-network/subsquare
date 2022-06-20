import { useState } from "react";
import PollForm from "./polls/form";
import { FormTitleWrapper, FormTitle, FormToggler } from "./elements";

function AdvancedForm(props = {}) {
  const { disabled = false, formValue = {}, setFormValue = () => {} } = props;
  const [isAdvanced, setIsAdvanced] = useState(false);

  const handleToggle = () => {
    if (disabled) {
      return;
    }

    setIsAdvanced(!isAdvanced);
  };

  return (
    <>
      <FormTitleWrapper>
        <FormTitle>Advanced</FormTitle>
        <FormToggler disabled={disabled} onClick={handleToggle}>
          {isAdvanced ? "Cancel" : "Create a poll"}
        </FormToggler>
      </FormTitleWrapper>

      <PollForm
        disabled={disabled}
        isCreatePoll={isAdvanced}
        formValue={formValue}
        setFormValue={setFormValue}
      />
    </>
  );
}

export default AdvancedForm;
