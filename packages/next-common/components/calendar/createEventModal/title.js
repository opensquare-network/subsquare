import React from "react";
import Labeled from "../../../components/Labeled";
import LineInput from "../../lineInput";

export default function Title({ setValue }) {
  return (
    <Labeled text={"Title"}>
      <LineInput placeholder="Please fill the title..." setValue={setValue} />
    </Labeled>
  );
}
