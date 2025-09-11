import PrimaryButton from "next-common/lib/button/primary";
import Tooltip from "next-common/components/tooltip";

function SubmitButton({ onClick, loading, content, buttonText }) {
  const isEmpty = content === "" || content === "<p><br></p>";

  return (
    <Tooltip content={isEmpty ? "Cannot submit empty content" : ""}>
      <PrimaryButton loading={loading} onClick={onClick} disabled={isEmpty}>
        {buttonText}
      </PrimaryButton>
    </Tooltip>
  );
}

export function CreateButton({ onClick, loading, content }) {
  return (
    <SubmitButton
      buttonText="Create"
      onClick={onClick}
      loading={loading}
      content={content}
    />
  );
}

export function UpdateButton({ onClick, loading, content }) {
  return (
    <SubmitButton
      buttonText="Update"
      onClick={onClick}
      loading={loading}
      content={content}
    />
  );
}
