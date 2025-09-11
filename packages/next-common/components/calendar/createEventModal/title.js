import React from "react";
import Labeled from "../../../components/Labeled";
import Input from "next-common/lib/input";

export default function Title({ setValue }) {
  return (
    <Labeled text={"Title"}>
      <Input placeholder="Please fill the title..." onValueChange={setValue} />
    </Labeled>
  );
}
