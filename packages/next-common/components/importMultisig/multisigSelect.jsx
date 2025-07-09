import MultisigRadioGroup from "./multisigRadioGroup";
import PrimaryButton from "next-common/lib/button/primary";

export default function MultisigSelect({
  list = [],
  selected,
  setSelected,
  onContinue,
}) {
  return (
    <>
      <MultisigRadioGroup
        options={list}
        selected={selected}
        setSelected={setSelected}
      />
      <div className="flex items-center justify-end">
        <PrimaryButton disabled={!selected} onClick={onContinue}>
          Continue
        </PrimaryButton>
      </div>
    </>
  );
}
