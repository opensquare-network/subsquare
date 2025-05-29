import Button from "next-common/lib/button";
import { ArrowLineLeft } from "@osn/icons/subsquare";

export default function PreviousButton({ onClick, isLoading }) {
  return (
    <Button
      className={`gap-2 p-2 pr-4 border-neutral400 hover:border-neutral500 text-textPrimary ${
        isLoading
          ? " cursor-not-allowed text-textDisabled border-neutral300"
          : ""
      }`}
      disabled={isLoading}
      onClick={onClick}
    >
      <ArrowLineLeft className="w-6 h-6" />
      Previous
    </Button>
  );
}
