import {
  FormItemWrapper,
  FormLabel,
  FormLabelWrapper,
  FormExternalLabel,
} from "./elements";

function FormItem({ label, labelExternal, children }) {
  return (
    <FormItemWrapper>
      <FormLabelWrapper>
        <FormLabel>{label}</FormLabel>
        {labelExternal && (
          <FormExternalLabel>{labelExternal}</FormExternalLabel>
        )}
      </FormLabelWrapper>

      {children}
    </FormItemWrapper>
  );
}

export default FormItem;
