import React from "react";
import Labeled from "../../../components/Labeled";
import LineInput from "../../lineInput";

export default function Link({ setValue }) {
  return (
    <Labeled text={"Link"}>
      <LineInput
        placeholder="Please fill the link..."
        setValue={setValue}
      />
    </Labeled>
  );
}
