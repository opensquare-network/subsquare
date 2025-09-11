import React from "react";
import TextAreaInput from "../../../components/textAreaInput";
import Labeled from "../../../components/Labeled";

export default function Description({ setValue }) {
  return (
    <Labeled text={"Description"}>
      <TextAreaInput
        placeholder="Please fill the description..."
        setValue={setValue}
      />
    </Labeled>
  );
}
