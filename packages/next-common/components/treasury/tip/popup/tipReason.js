import React from "react";
import TextInput from "../../../textInput";
import PopupLabel from "../../../popup/label";

export default function TipReason({ setValue }) {
  return (
    <div>
      <PopupLabel
        text={"Reason"}
        tooltip={"The tip reason"}
      />
      <TextInput setValue={setValue} />
    </div>
  );
}
