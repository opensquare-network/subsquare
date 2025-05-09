import {
  SystemRadioButtonOn,
  SystemRadioButtonOff,
} from "@osn/icons/subsquare";

export default function RadioButton({ checked, disabled = false }) {
  return (
    <div className="inline-flex [&_svg]:w-[20px] [&_svg]:h-[20px] [&_path]:fill-theme500">
      {disabled ? (
        <SystemRadioButtonOff className="[&_path]:fill-textDisabled text-textDisabled" />
      ) : checked ? (
        <SystemRadioButtonOn />
      ) : (
        <SystemRadioButtonOff />
      )}
    </div>
  );
}
