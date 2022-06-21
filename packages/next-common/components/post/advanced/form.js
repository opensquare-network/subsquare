import React, { forwardRef, useImperativeHandle, useRef } from "react";
import PollForm from "./polls/form";
import { FormTitleWrapper, FormTitle, FormToggler } from "./elements";

function AdvancedForm(props = {}, ref) {
  const {
    isAdvanced,
    setIsAdvanced,
    disabled = false,
    formValue = {},
    setFormValue = () => {},
  } = props;

  const pollForm = useRef();

  const handleToggle = () => {
    if (disabled) {
      return;
    }

    setIsAdvanced(!isAdvanced);
  };

  const validateForm = () => {
    if (!isAdvanced) {
      return true;
    }

    let result = false;
    result = pollForm.current?.validateForm();

    return result;
  };

  useImperativeHandle(ref, () => ({
    validateForm,
  }));

  return (
    <>
      <FormTitleWrapper>
        <FormTitle>Advanced</FormTitle>
        <FormToggler disabled={disabled} onClick={handleToggle}>
          {isAdvanced ? "Cancel" : "Create a poll"}
        </FormToggler>
      </FormTitleWrapper>

      <PollForm
        ref={pollForm}
        disabled={disabled}
        isCreatePoll={isAdvanced}
        formValue={formValue}
        setFormValue={setFormValue}
      />
    </>
  );
}

export default forwardRef(AdvancedForm);
