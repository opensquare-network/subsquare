import {
  SystemRadioButtonOn,
  SystemRadioButtonOff,
} from "@osn/icons/subsquare";
import noop from "lodash.noop";

export default function RadioButton({ checked, onClick = noop }) {
  return (
    <div
      className="cursor-pointer inline-flex [&_svg]:w-[20px] [&_svg]:h-[20px] [&_path]:fill-theme500"
      onClick={onClick}
    >
      {checked ? <SystemRadioButtonOn /> : <SystemRadioButtonOff />}
    </div>
  );
}
