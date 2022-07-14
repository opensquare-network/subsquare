import React from "react";
import TextInput from "../../../textInput";
import Labeled from "../../../Labeled";

export default function TipReason({ setValue }) {
  return (
    <Labeled text={"Reason"} tooltip={"The tip reason"}>
      <TextInput setValue={setValue} />
    </Labeled>
  );
}
