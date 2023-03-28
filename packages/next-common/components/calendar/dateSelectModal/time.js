import React from "react";
import Labeled from "../../../components/Labeled";
import noop from "lodash.noop";
import LineInput from "../../lineInput";
import Flex from "../../styled/flex";

export default function Time({ onChange = noop }) {
  return (
    <Labeled text={"Time"}>
      <Flex>
        <LineInput placeholder="00" onChange={() => onChange()} />
        <span style={{ padding: 8 }}>:</span>
        <LineInput placeholder="00" onChange={() => onChange()}/>
      </Flex>
    </Labeled>
  );
}
