import React from "react";
import TextInput from "../../../components/textInput";
import Labeled from "../../../components/Labeled";

export default function Description({ setValue }) {
  return (
    <Labeled text={"Description"}>
      <TextInput
        placeholder="Please fill the description..."
        setValue={setValue}
      />
    </Labeled>
  );
}
