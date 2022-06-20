import { useState } from "react";
import PollForm from "./polls/form";
import { FormTitleWrapper, FormTitle } from "./elements";
import Toggler from "./toggler.js";

function AdvancedForm(props = {}) {
  const { formValue = {}, setFormValue = () => {} } = props;
  const [isAdvanced, setIsAdvanced] = useState(false);

  return (
    <>
      <FormTitleWrapper>
        <FormTitle>Advanced</FormTitle>
        <Toggler isAdvanced={isAdvanced} setIsAdvanced={setIsAdvanced} />
      </FormTitleWrapper>

      <PollForm
        isCreatePoll={isAdvanced}
        formValue={formValue}
        setFormValue={setFormValue}
      />
    </>
  );
}

export default AdvancedForm;
