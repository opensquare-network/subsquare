import React from "react";
import Labeled from "../../../components/Labeled";
import Input from "next-common/lib/input";

export default function Link({ setValue }) {
  return (
    <Labeled text={"Link"}>
      <Input placeholder="Please fill the link..." onValueChange={setValue} />
    </Labeled>
  );
}
