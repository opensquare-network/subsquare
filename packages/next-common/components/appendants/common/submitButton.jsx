import PrimaryButton from "next-common/lib/button/primary";
import Tooltip from "next-common/components/tooltip";

export function CreateButton({ onClick, loading, content }) {
  const isEmpty = content === "" || content === "<p><br></p>";

  return (
    <Tooltip content={isEmpty ? "Cannot submit empty content" : ""}>
      <PrimaryButton loading={loading} onClick={onClick} disabled={isEmpty}>
        Submit
      </PrimaryButton>
    </Tooltip>
  );
}

export function UpdateButton({ onClick, loading, content }) {
  const isEmpty = content === "" || content === "<p><br></p>";

  return (
    <Tooltip content={isEmpty ? "Cannot submit empty content" : ""}>
      <PrimaryButton loading={loading} onClick={onClick} disabled={isEmpty}>
        Update
      </PrimaryButton>
    </Tooltip>
  );
}
