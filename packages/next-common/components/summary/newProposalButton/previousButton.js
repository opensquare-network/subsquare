import Button from "next-common/lib/button";

export default function PreviousButton({ onClick, isLoading }) {
  return (
    <Button
      className={`border-neutral400 hover:border-neutral500 text-textPrimary ${
        isLoading
          ? " cursor-not-allowed text-textDisabled border-neutral300"
          : ""
      }`}
      disabled={isLoading}
      onClick={onClick}
    >
      Previous
    </Button>
  );
}
