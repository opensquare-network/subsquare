import PrimaryButton from "next-common/lib/button/primary";
import Tooltip from "next-common/components/tooltip";

export function CreateButton({ onClick, loading, disabled, content }) {
  const isEmpty = content === "" || content === "<p><br></p>";
  const isDisabled = disabled || isEmpty;

  return (
    <Tooltip content={isEmpty ? "Cannot submit empty content" : ""}>
      <PrimaryButton loading={loading} onClick={onClick} disabled={isDisabled}>
        Submit
      </PrimaryButton>
    </Tooltip>
  );
}

export function UpdateButton({ onClick, loading, disabled, content }) {
  const isEmpty = content === "" || content === "<p><br></p>";
  const isDisabled = disabled || isEmpty;

  return (
    <Tooltip content={isEmpty ? "Cannot submit empty content" : ""}>
      <PrimaryButton loading={loading} onClick={onClick} disabled={isDisabled}>
        Update
      </PrimaryButton>
    </Tooltip>
  );
}
