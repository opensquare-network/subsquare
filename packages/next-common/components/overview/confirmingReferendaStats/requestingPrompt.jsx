import ValueDisplay from "next-common/components/valueDisplay";
import useTreasuryRequesting from "next-common/hooks/useTreasuryRequesting";
import Prompt from "./prompt";

export default function RequestingPrompt({ onClose, confirmingCount }) {
  const { confirmingValue, loading } = useTreasuryRequesting();

  let requesting = null;

  if (confirmingValue?.gt(0)) {
    requesting = (
      <>
        <span>,&nbsp;</span>
        <span>requesting&nbsp;</span>
        <ValueDisplay
          className="font-bold"
          value={confirmingValue}
          symbol={""}
          prefix={"$"}
        />
      </>
    );
  }

  if (loading) {
    return null;
  }

  return (
    <Prompt
      onClose={onClose}
      confirmingCount={confirmingCount}
      requesting={requesting}
    />
  );
}
