import React from "react";
import Flex from "../styled/flex";
import User from "./index";
import ExtrinsicLinks from "../links";

export default function UserWithLink({ address, chain }) {
  return (
    <Flex>
      <User add={address} fontSize={14} />
      <ExtrinsicLinks chain={chain} address={address} style={{ marginLeft: 8 }} />
    </Flex>
  );
}
