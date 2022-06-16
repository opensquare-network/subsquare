import PollForm from "./polls/form";
import { FormTitleWrapper, FormTitle } from "./elements";
import Toggler from "./toggler.js";

function AdvancedForm() {
  return (
    <>
      <FormTitleWrapper>
        <FormTitle>Advanced</FormTitle>
        <Toggler />
      </FormTitleWrapper>

      <PollForm />
    </>
  );
}

export default AdvancedForm;
