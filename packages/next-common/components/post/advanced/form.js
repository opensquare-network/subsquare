import React, { forwardRef, useImperativeHandle, useRef } from "react";
import PollForm from "./polls/form";
import { cn } from "next-common/utils";

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
      <div className="flex justify-between items-center my-6">
        <div className="text14Bold">Advanced</div>
        <button
          className={cn(
            "text14Medium select-none text-theme500",
            disabled && "cursor-not-allowed text-textDisabled",
          )}
          disabled={disabled}
          onClick={handleToggle}
        >
          {isAdvanced ? "Cancel" : "Create a poll"}
        </button>
      </div>

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
