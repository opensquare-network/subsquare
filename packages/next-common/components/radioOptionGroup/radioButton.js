import {
  SystemRadioButtonOn,
  SystemRadioButtonOff,
} from "@osn/icons/subsquare";

export default function RadioButton({ checked }) {
  return (
    <div className="inline-flex [&_svg]:w-[20px] [&_svg]:h-[20px] [&_path]:fill-theme500">
      {checked ? <SystemRadioButtonOn /> : <SystemRadioButtonOff />}
    </div>
  );
}
