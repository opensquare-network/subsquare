import PrimaryButton from "next-common/lib/button/primary";
import Tooltip from "next-common/components/tooltip";
import useIsMuted, { MUTED_TOOLTIP_TEXT } from "next-common/hooks/useIsMuted";

function SubmitButton({ onClick, loading, content, buttonText }) {
  const isEmpty = content === "" || content === "<p><br></p>";
  const isMuted = useIsMuted();

  return (
    <Tooltip
      content={
        isMuted
          ? MUTED_TOOLTIP_TEXT
          : isEmpty
          ? "Cannot submit empty content"
          : ""
      }
    >
      <PrimaryButton
        loading={loading}
        onClick={onClick}
        disabled={isEmpty || isMuted}
      >
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
