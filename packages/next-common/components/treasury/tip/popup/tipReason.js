import React from "react";
import TextAreaInput from "../../../textAreaInput";
import Labeled from "../../../Labeled";

export default function TipReason({ setValue }) {
  return (
    <Labeled text={"Reason"} tooltip={"The tip reason"}>
      <TextAreaInput
        setValue={setValue}
        placeholder="Please fill the reason..."
      />
    </Labeled>
  );
}
